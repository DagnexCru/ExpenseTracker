# 78. Dual-Token Authentication Architecture: Cookies & Bearer Headers

## 1. Overview
SpendWise supports dual token extraction in `server/src/middleware/auth.middleware.js` to enable seamless operation across web browsers, mobile clients, automated tests, and Postman API runners.

## 2. Token Extraction Hierarchy
The authentication middleware examines credentials in the following strict order:
1. **HTTP-Only Cookie (`req.cookies.token`)**: Primary method for web browser clients, providing robust protection against Cross-Site Scripting (XSS).
2. **Authorization Header (`req.headers.authorization`)**: Secondary fallback method parsing `Bearer <token>` for Postman, mobile apps, and automated test runners.

## 3. Implementation Code
```javascript
let token = req.cookies?.token;
if (!token && req.headers?.authorization?.startsWith('Bearer ')) {
  token = req.headers.authorization.split(' ')[1];
}
```

## 4. Security Guarantees
- Both channels verify identical JWT signatures using `JWT_SECRET`.
- Token expiry and payload integrity checks apply universally regardless of transmission channel.
- If no token is located or if signature verification fails, the server responds with HTTP 401 Unauthorized (`AUTH_TOKEN_MISSING` or `AUTH_TOKEN_INVALID`).
