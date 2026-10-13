# SpendWise — Authentication Middleware Pipeline Flow

## Execution Order

1. **Incoming Request:** Client sends HTTP request to protected route (`GET /api/auth/me` or `/api/transactions`).
2. **Cookie Inspection:** `auth.middleware.js` checks `req.cookies?.token`.
3. **Header Fallback:** If cookie is missing, checks `req.headers.authorization?.startsWith('Bearer ')`.
4. **Token Extraction:** Extracts raw JWT string.
5. **Signature & Expiration Verification:** Executes `jwt.verify(token, JWT_SECRET)`.
6. **Revocation Check:** Checks `tokenBlacklist.isRevoked(token)`.
7. **Database Hydration:** Executes `User.findById(decoded.id).select('-password')`.
8. **Request Attachment:** Sets `req.user = user` and calls `next()`.
