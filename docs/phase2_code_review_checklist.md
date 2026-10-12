# SpendWise Phase 2 — Senior Engineer Code Review Sign-Off

## 1. Security & Cryptography
- [x] bcrypt salt rounds >= 10.
- [x] `User.js` pre-save hook guards re-hashing with `this.isModified('password')`.
- [x] Passwords never returned in response JSON (`toJSON` transform deletes `password`).
- [x] Passwords never logged in morgan or console.

## 2. Token & Session Management
- [x] JWT signed with 7-day expiration.
- [x] Secret key loaded from `JWT_SECRET` environment variable.
- [x] Cookie configured with `HttpOnly: true` and `SameSite: 'lax'`.
- [x] Cookie cleared with expired date on logout (`POST /api/auth/logout`).

## 3. Database Integrity
- [x] Email index has `unique: true`.
- [x] Email is lowercased and trimmed automatically.
- [x] Currency is restricted to enum: `['ETB', 'USD', 'EUR', 'GBP']` with `ETB` default.

## 4. Frontend UX
- [x] Live password strength feedback.
- [x] Error alert banners dismissible.
- [x] Demo credentials button for reviewers.
- [x] Protected routes redirect unauthenticated users cleanly.
