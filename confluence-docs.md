# **Postman Student Community Badge Verifier**

## Overview
The **Postman Student Community Badge Verifier API** allows users to validate whether a single or multiple email addresses are eligible for **Student Expert** or **Student Leader** roles based on their badge information.

This documentation provides details about the available endpoints, request/response formats, deployment instructions, and integration with the Badgr API.

---

## **Endpoints**

### 1. **Health Check**
#### Method: `GET /health`

**Description**:  
Checks the health status of the service.

#### Response Example:
```json
{
  "status": "healthy",
  "timestamp": "2025-01-19T12:00:00Z"
}
```

---

### 2. **Validate Single Email**
#### Method: `POST /validate`

**Description**:  
Checks if a given email is eligible for **Student Expert** or **Student Leader** roles.

#### Headers:
| Header       | Value         | Required | Description                    |
|--------------|---------------|----------|--------------------------------|
| `x-api-key`  | `{API_KEY}`   | Yes      | API key for authorization.     |

#### Request Body:
```json
{
  "email": "example@student.com"
}
```

#### Response Example:
- **Success (200)**:
  ```json
  {
    "message": "Verified!",
    "requestCost": "0.5",
    "rateLimitRemaining": "99.5"
  }
  ```

- **Error (403)**:
  ```json
  {
    "status": "error",
    "message": "Forbidden: Invalid API Key"
  }
  ```

---

### 3. **Validate Multiple Emails**
#### Method: `POST /validate-multiple`

**Description**:  
Validates multiple email addresses for **Student Expert** or **Student Leader** roles eligibility.

#### Headers:
| Header       | Value         | Required | Description                    |
|--------------|---------------|----------|--------------------------------|
| `x-api-key`  | `{API_KEY}`   | Yes      | API key for authorization.     |

#### Request Body:
```json
{
  "emails": ["example1@student.com", "example2@student.com"]
}
```

#### Response Example:
- **Success (200)**:
  ```json
  [
    {
      "email": "example1@student.com",
      "message": "Verified!",
      "requestCost": "0.5",
      "rateLimitRemaining": "99.0"
    },
    {
      "email": "example2@student.com",
      "message": "Not Verified!",
      "requestCost": "0.5",
      "rateLimitRemaining": "98.5"
    }
  ]
  ```

- **Error (403)**:
  ```json
  {
    "status": "error",
    "message": "Forbidden: Invalid API Key"
  }
  ```

---

## **Deployment on Replit**

### Steps to Deploy:
1. **Clone the Repository**:
   - Go to [Replit](https://replit.com/) and create a new project by importing the GitHub repository URL.

2. **Configure Environment Variables**:
   - Open the `.env` file in Replit and add the following:
     ```plaintext
     PORT=3000
     API_KEY=<your-uuid-api-key>
     BADGR_ISSUER_EMAIL=<issuer-email>
     BADGR_ISSUER_PASSWORD=<issuer-password>
     BADGR_ISSUER_PUBLIC_ID=<issuer-public-id>
     BADGR_STUDENT_EXPERT_BADGE_CLASS_ID=<badge-class-id>
     BADGR_API_BASE_URL=https://api.badgr.io/v2
     ```

3. **Install Dependencies**:
   Run the following command in the Replit shell:
   ```bash
   npm install
   ```

4. **Run the Application**:
   - Start the server by running the `npm start` command.
   - Access the API at the URL provided by Replit, such as `https://your-replit-url.replit.co`.

---

## **Badgr API Details**

### Overview
The Badgr API is used to fetch badge assertions and validate user eligibility for specific roles. This API integrates with the **Postman Student Community Badge Verifier** to verify badges associated with email addresses.

### Key Endpoints Used:
1. **Token Endpoint**:  
   URL: `https://api.badgr.io/o/token`  
   **Purpose**: Obtain an access token using the badge issuer's credentials.

2. **Assertions Endpoint**:  
   URL: `https://api.badgr.io/v2/issuers/{issuer_id}/assertions?recipient={email}`  
   **Purpose**: Retrieve badge assertions for a specific email.  
   - `{issuer_id}`: The public ID of the badge issuer.  
   - `{email}`: The recipient's email address.

### Authentication
- The API uses OAuth 2.0 for authentication.
- The **Token Endpoint** generates an `access_token` that is used in subsequent API calls.

### Rate Limiting
The Badgr API employs a **leaky bucket algorithm** to enforce rate limiting:
- Each request has a "cost" (`X-Request-Cost`).
- The remaining quota is indicated in `X-Rate-Limit-Remaining`.

### Environment Variable Configuration:
| Variable                        | Description                                         |
|---------------------------------|-----------------------------------------------------|
| `BADGR_ISSUER_EMAIL`            | Email for the badge issuer.                        |
| `BADGR_ISSUER_PASSWORD`         | Password for the badge issuer.                     |
| `BADGR_ISSUER_PUBLIC_ID`        | Public ID of the badge issuer.                     |
| `BADGR_STUDENT_EXPERT_BADGE_CLASS_ID` | Badge class ID for Student Expert.             |

---

## **Error Handling**

The API returns errors in the following format:
```json
{
  "status": "error",
  "message": "string",
  "errors": [ ... ] // Optional array of error details
}
```

### Common Errors:
| Status | Message                    | Description                              |
|--------|----------------------------|------------------------------------------|
| 403    | Forbidden: Invalid API Key | The API key provided is invalid.         |
| 400    | Bad Request                | The request body is missing or malformed.|

---

## **Rate Limiting**
To avoid hitting the rate limit:
- Requests to `/validate-multiple` are spaced out with a delay (default: 100ms) between each API call.
- Monitor `X-Request-Cost` and `X-Rate-Limit-Remaining` in responses to adjust request rates dynamically.
