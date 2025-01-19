API Documentation: Postman Student Community Badge Verifier
Table of Contents
Health Check
Validate Single Email
Validate Multiple Emails
Health Check
Endpoint
GET /health

Description
Check the health of the service.

Response
json
Copy
Edit
{
  "status": "healthy",
  "timestamp": "2025-01-19T12:00:00Z"
}
Validate Single Email
Endpoint
POST /validate

Description
Checks if a given email is eligible for Student Expert or Student Leader roles.

Headers
Key	Value	Required	Description
x-api-key	{API_KEY}	Yes	Your API key for authorization.
Request Body
json
Copy
Edit
{
  "email": "example@student.com"
}
Response
Success Response (200)
json
Copy
Edit
{
  "message": "Verified!",
  "requestCost": "0.5",
  "rateLimitRemaining": "99.5"
}
Error Response (403)
json
Copy
Edit
{
  "status": "error",
  "message": "Forbidden: Invalid API Key"
}
Validate Multiple Emails
Endpoint
POST /validate-multiple

Description
Checks if multiple email addresses are eligible for Student Expert or Student Leader roles.

Headers
Key	Value	Required	Description
x-api-key	{API_KEY}	Yes	Your API key for authorization.
Request Body
json
Copy
Edit
{
  "emails": ["example1@student.com", "example2@student.com"]
}
Response
Success Response (200)
json
Copy
Edit
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
Error Response (403)
json
Copy
Edit
{
  "status": "error",
  "message": "Forbidden: Invalid API Key"
}
Error Schema
Format
json
Copy
Edit
{
  "status": "error",
  "message": "string",
  "errors": [ ... ] // Optional array of errors
}
Possible Errors
Status	Message	Description
403	Forbidden: Invalid API Key	The API key provided is invalid.
400	Bad Request	The request body is missing or malformed.
This documentation provides all details about the API endpoints, including request/response formats, headers, and examples. Let me know if you'd like further refinements or additions!
