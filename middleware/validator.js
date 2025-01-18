const OpenApiValidator = require("express-openapi-validator");
const path = require("path");

const specPath = path.join(__dirname, "../schema.yaml");

const validator = OpenApiValidator.middleware({ apiSpec: specPath });

module.exports = { validator };