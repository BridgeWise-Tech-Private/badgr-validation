const express = require("express");
const axios = require("axios");
const app = express();
const { validator } = require("./middleware/validator");
const { handleErrors } = require("./middleware/handleErrors");
const qs = require("qs");

// body parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Middleware for API key authentication
const authenticateApiKey = (req, res, next) => {
  const apiKey = req.headers["x-api-key"];
  if (!apiKey || apiKey !== process.env.API_KEY) {
    return res.status(403).json({ status: "error", message: "Forbidden: Invalid API Key" });
  }
  next();
};

// apply schema validation for incoming requests
app.use(validator);

let accessToken = null;
let refreshToken = null;
let tokenExpiry = null;

const BADGR_AUTH_URL = "https://api.badgr.io/o/token";
const BADGR_API_BASE_URL = "https://api.badgr.io/v2";
const RATE_LIMIT_DELAY = 100; // 100 ms delay between requests

app.get("/", (req, res) => {
  res.send("OK");
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).send({ status: "healthy", timestamp: new Date().toISOString() });
});

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const getAuth = async () => {
  const data = qs.stringify({
    username: process.env.BADGR_ISSUER_EMAIL,
    password: process.env.BADGR_ISSUER_PASSWORD,
  });

  const config = {
    method: "post",
    url: BADGR_AUTH_URL,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: data,
  };

  const response = await axios(config);
  return response.data;
};

const refreshAuthToken = async () => {
  const data = qs.stringify({
    grant_type: "refresh_token",
    refresh_token: refreshToken,
  });

  const config = {
    method: "post",
    url: BADGR_AUTH_URL,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: data,
  };

  const response = await axios(config);
  return response.data;
};

const getAccessToken = async () => {
  if (accessToken && tokenExpiry && new Date() < tokenExpiry) {
    return accessToken;
  }

  try {
    const auth = await (refreshToken ? refreshAuthToken() : getAuth());
    if (!auth || !auth.access_token) throw new Error("No access token returned");

    accessToken = auth.access_token;
    refreshToken = auth.refresh_token;
    tokenExpiry = new Date(new Date().getTime() + auth.expires_in * 1000);

    return accessToken;
  } catch (e) {
    e.message = "Internal server error. No Access Token Update manually.";
    throw e;
  }
};

const getAssertionsByEmail = async (email) => {
  const token = await getAccessToken();
  const emailEncoded = encodeURIComponent(email);

  const url = `${BADGR_API_BASE_URL}/issuers/${process.env.BADGR_ISSUER_PUBLIC_ID}/assertions?recipient=${emailEncoded}`;

  const config = {
    method: "get",
    url,
    headers: { Authorization: `Bearer ${token}` },
  };

  const response = await axios(config);
  const requestCost = response.headers["x-request-cost"];
  const rateLimitRemaining = response.headers["x-rate-limit-remaining"];

  return { data: response.data, requestCost, rateLimitRemaining };
};

app.post("/validate", authenticateApiKey, async (req, res, next) => {
  const { email } = req.body;

  try {
    const { data, requestCost, rateLimitRemaining } = await getAssertionsByEmail(email);
    if (!data || !data.result) throw new Error("No response when looking up assertions");

    const assertions = data.result;
    const validAssertions = assertions.filter((a) => !a.revoked);
    const validBadgeClasses = validAssertions.map((a) => a.badgeclass);

    const isStudentExpert = validBadgeClasses.includes(process.env.BADGR_STUDENT_EXPERT_BADGE_CLASS_ID);

    return res.send({
      message: isStudentExpert ? "Verified!" : "Not Verified!",
      requestCost,
      rateLimitRemaining,
    });
  } catch (e) {
    return next(e);
  }
});

app.post("/validate-multiple", authenticateApiKey, async (req, res, next) => {
  const { emails } = req.body;

  try {
    const assertionsResults = [];
    for (const email of emails) {
      await delay(RATE_LIMIT_DELAY); // Add delay between requests
      const result = await getAssertionsByEmail(email).then(({ data, requestCost, rateLimitRemaining }) => {
        if (!data || !data.result) throw new Error(`No response when looking up assertions for ${email}`);
        return { email, assertions: data.result, requestCost, rateLimitRemaining };
      }).catch((error) => {
        return { email, error: error.message };
      });
      assertionsResults.push(result);
    }

    const results = assertionsResults.map(({ email, assertions, error, requestCost, rateLimitRemaining }) => {
      if (error) {
        return { email, message: "Error occurred", error, requestCost, rateLimitRemaining };
      }

      const validAssertions = assertions.filter((a) => !a.revoked);
      const validBadgeClasses = validAssertions.map((a) => a.badgeclass);

      const isStudentExpert = validBadgeClasses.includes(process.env.BADGR_STUDENT_EXPERT_BADGE_CLASS_ID);

      return { email, message: isStudentExpert ? "Verified!" : "Not Verified!", requestCost, rateLimitRemaining };
    });

    res.send(results);
  } catch (e) {
    return next(e);
  }
});

// apply error handler
app.use(handleErrors);

// listen for requests
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
