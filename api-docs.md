# API Documentation: Postman Student Community Badge Verifier

## Table of Contents
1. [Health Check](#health-check)
2. [Validate Single Email](#validate-single-email)
3. [Validate Multiple Emails](#validate-multiple-emails)

---

## Health Check

### Endpoint
**GET** `/health`

### Description
Check the health of the service.

### Response
```json
{
  "status": "healthy",
  "timestamp": "2025-01-19T12:00:00Z"
}
```

---

## Validate Single Email

### Endpoint
**POST** `/validate`

### Description
Checks if a given email is eligible for Student Expert or Student Leader roles.

### Headers
| Key         | Value         | Required | Description           |
|-------------|---------------|----------|-----------------------|
| `x-api-key` | `{API_KEY}`   | Yes      | Your API key for authorization. |

### Request Body
```json
{
  "email": "example@student.com"
}
```

### Response
#### Success Response (200)
```json
{
  "message": "Verified!",
  "requestCost": "0.5",
  "rateLimitRemaining": "99.5"
}
```

#### Error Response (403)
```json
{
  "status": "error",
  "message": "Forbidden: Invalid API Key"
}
```

---

## Validate Multiple Emails

### Endpoint
**POST** `/validate-multiple`

### Description
Checks if multiple email addresses are eligible for Student Expert or Student Leader roles.

### Headers
| Key         | Value         | Required | Description           |
|-------------|---------------|----------|-----------------------|
| `x-api-key` | `{API_KEY}`   | Yes      | Your API key for authorization. |

### Request Body
```json
{
  "emails": ["example1@student.com", "example2@student.com"]
}
```

### Response
#### Success Response (200)
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

#### Error Response (403)
```json
{
  "status": "error",
  "message": "Forbidden: Invalid API Key"
}
```

---

## Error Schema
### Format
```json
{
  "status": "error",
  "message": "string",
  "errors": [ ... ] // Optional array of errors
}
```

### Possible Errors
| Status | Message                    | Description                              |
|--------|----------------------------|------------------------------------------|
| 403    | Forbidden: Invalid API Key | The API key provided is invalid.         |
| 400    | Bad Request                | The request body is missing or malformed.|
