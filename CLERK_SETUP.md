# Clerk Authentication Setup

ElectroMart now uses Clerk for sign-up email verification and session authentication.

## 1. Clerk Dashboard

Create a Clerk application and enable:

- Sign-up with email
- Require email address
- Verify at sign-up -> Email verification code
- Sign-in with email
- Sign-up with password
- Sign-in with password

The custom ElectroMart registration flow sends a Clerk verification code and verifies it before the account is finalized. Clerk's current email verification code flow is documented here:
https://clerk.com/docs/guides/development/custom-flows/authentication/email-password

## 2. Clerk session token claim

In Clerk Dashboard -> Sessions -> Customize session token, add this claim:

```json
{
  "email": "{{user.primary_email_address}}"
}
```

The Spring Boot API requires this claim so it can map the verified Clerk session to the existing ElectroMart user record.

## 3. Frontend environment

For local development create `.env.local`:

```
REACT_APP_CLERK_PUBLISHABLE_KEY=pk_test_your_key
REACT_APP_API_URL=http://localhost:8091
```

For Vercel, add the same variables in Project Settings -> Environment Variables.

Never put a Clerk secret key in the React app.

## 4. Backend environment

For local development:

```
CLERK_ISSUER_URL=https://your-instance.clerk.accounts.dev
```

For Render, add `CLERK_ISSUER_URL` as an environment variable.

The value must match the `iss` claim of Clerk's session JWT. Spring Security uses the issuer to discover Clerk's public keys and validate the JWT signature and standard time/issuer claims.

## 5. How ElectroMart authentication works

1. User enters name, email and password.
2. Clerk creates the sign-up attempt.
3. Clerk sends the email verification code.
4. User enters the code.
5. Clerk verifies the email and creates the authenticated session.
6. React obtains the short-lived Clerk session token.
7. Axios sends it as `Authorization: Bearer <token>` to Spring Boot.
8. Spring Security validates the Clerk JWT.
9. `/api/auth/clerk/sync` creates or updates the matching ElectroMart database user.
10. Cart, wishlist, orders, profile and other protected APIs continue using the existing ElectroMart user record.

The local custom OTP endpoints are no longer used by the frontend.
