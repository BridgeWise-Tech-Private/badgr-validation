
# Postman Student Community Badge Verifier

A RESTful API to validate if a user or multiple users are eligible for **Student Expert** or **Student Leader** roles based on their badges.

## Table of Contents
- [Overview](#overview)
- [Getting Started](#getting-started)
- [API Endpoints](#api-endpoints)
  - [Health Check](#health-check)
  - [Validate Single Email](#validate-single-email)
  - [Validate Multiple Emails](#validate-multiple-emails)
- [Error Handling](#error-handling)
- [License](#license)

---

## Overview

This API verifies whether a user (or multiple users) has the necessary badges to qualify for the **Student Expert** or **Student Leader** roles. The verification process uses badges associated with the user's email and supports single and batch email verification.

---

## Getting Started

### Prerequisites
1. Node.js and npm installed on your machine.
2. Environment variables configured:
   - `PORT`: The port number for the API server.
   - `API_KEY`: A UUID string used as the authorization API key.
   - `BADGR_ISSUER_EMAIL`: The email for the badge issuer.
   - `BADGR_ISSUER_PASSWORD`: The password for the badge issuer.
   - `BADGR_ISSUER_PUBLIC_ID`: The public ID of the badge issuer.
   - `BADGR_STUDENT_EXPERT_BADGE_CLASS_ID`: Badge class ID for Student Expert.
   - `BADGR_API_BASE_URL`: The base URL for Badgr API.

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo-name.git
   cd your-repo-name
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   npm start
   ```

4. Access the API at `http://localhost:<PORT>`.

---

## API Endpoints

### 1. Health Check

**Endpoint**: `GET /health`  
**Description**: Check the health of the service.

#### Response
```json
{
  "status": "healthy",
  "timestamp": "2025-01-19T12:00:00Z"
}
```

---

### 2. Validate Single Email

**Endpoint**: `POST /validate`  
**Description**: Checks if a given email is eligible for Student Expert or Student Leader roles.

#### Headers
| Key         | Value        | Required | Description           |
|-------------|--------------|----------|-----------------------|
| `x-api-key` | `{API_KEY}`  | Yes      | Your API key for authorization. |

#### Request Body
```json
{
  "email": "example@student.com"
}
```

#### Response
**Success** (200):
```json
{
  "message": "Verified!",
  "requestCost": "0.5",
  "rateLimitRemaining": "99.5"
}
```

**Error** (403):
```json
{
  "status": "error",
  "message": "Forbidden: Invalid API Key"
}
```

---

### 3. Validate Multiple Emails

**Endpoint**: `POST /validate-multiple`  
**Description**: Checks if multiple email addresses are eligible for Student Expert or Student Leader roles.

#### Headers
| Key         | Value        | Required | Description           |
|-------------|--------------|----------|-----------------------|
| `x-api-key` | `{API_KEY}`  | Yes      | Your API key for authorization. |

#### Request Body
```json
{
  "emails": ["example1@student.com", "example2@student.com"]
}
```

#### Response
**Success** (200):
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

**Error** (403):
```json
{
  "status": "error",
  "message": "Forbidden: Invalid API Key"
}
```

---

## Error Handling

The API returns errors in the following format:

```json
{
  "status": "error",
  "message": "string",
  "errors": [ ... ] // Optional array of error details
}
```

| Status | Message                    | Description                              |
|--------|----------------------------|------------------------------------------|
| 403    | Forbidden: Invalid API Key | The API key provided is invalid.         |
| 400    | Bad Request                | The request body is missing or malformed.|

---
