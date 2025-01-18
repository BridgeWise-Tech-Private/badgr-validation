const defaultServerErrorMsg = "Internal server error. Contact a Postmanaut or try again later." 

const handleErrors = (err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).send({
    status: "error",
    message: err.message || defaultServerErrorMsg,
    errors: err.errors,
  });
};

module.exports = { handleErrors }