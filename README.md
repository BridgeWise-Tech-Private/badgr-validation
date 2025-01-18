# Badgr-badge-verifier-v1

Verifies that users with given email address have been issued Student Expert Certification or not. Made for Postman Partners for easy verification.

## Setup

Populate all environment variables:

`BADGR_ISSUER_EMAIL`
`BADGR_ISSUER_PASSWORD`

Email and password of a Badgr user with editor or higher permissions in the Postman issuer team.

*Note: If you used Google or other third party auth to create your Badgr account, you will need to add a password to the account. DO NOT USE YOUR GOOGLE PASSWORD. Instructions on how to add a password to Badgr accounts [here](https://badgr.org/app-developers/api-guide/) under "Don't have a password...?"*

`BADGR_ISSUER_PUBLIC_ID`

**Public** id of the issuer (Postman).

## Use

### Validate a single email id:

`POST /validate`

Request body 
```
{ 
  "email": "me@example.com"
}
```

### Validate a single email id: 

`POST /validate` 

Request body 
```
{ 
  "email": "me@example.com","me@example.com" "
}
```

