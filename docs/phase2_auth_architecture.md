# SpendWise Phase 2 — Authentication Architecture

## 1. High-Level Architecture Overview

SpendWise implements a **stateless hybrid JWT authentication model**:
- **HTTP-Only Cookie Transport**: Provides automatic credential transmission on every browser request with full protection against Cross-Site Scripting (XSS) attacks.
- **Authorization Header Support**: Accepts `Authorization: Bearer <token>` for mobile clients, external automation, and Postman testing suites.
- **Bcrypt Hash Isolation**: Never exposes password hashes to network responses or client contexts.

```
┌─────────────────────────────────┐
│     Client (React 18 + Vite)     │
└────────────────┬────────────────┘
                 │
                 │ 1. POST /api/auth/login { email, password }
                 ▼
┌─────────────────────────────────┐
│      Express 4 Auth Router      │
└────────────────┬────────────────┘
                 │
                 │ 2. Find User by Normalized Email
                 ▼
┌─────────────────────────────────┐
│      MongoDB / Mongoose 8       │
│      users Collection           │
└────────────────┬────────────────┘
                 │
                 │ 3. User document retrieved
                 ▼
┌─────────────────────────────────┐
│      bcrypt.compare(pass, hash) │
└────────────────┬────────────────┘
                 │
                 │ 4. Issue JWT (7d exp) & Set HTTP-Only Cookie
                 ▼
┌─────────────────────────────────┐
│     200 OK Response Payload     │
│  Set-Cookie: token=...; HttpOnly│
└─────────────────────────────────┘
```

## 2. Token Lifetime & Configuration
- **Algorithm**: HMAC-SHA256 (`HS256`)
- **Payload**: `{ id: user._id }`
- **Expiration**: 7 days (`7d`)
- **Secret**: `JWT_SECRET` environment variable (minimum 32-character high entropy string).

## 3. Cookie Security Headers
- `httpOnly: true` (prevents JavaScript access via `document.cookie`).
- `secure: process.env.NODE_ENV === 'production'` (enforces HTTPS transport in production).
- `sameSite: 'lax'` (prevents CSRF exploits while supporting standard navigation).
- `maxAge: 7 * 24 * 60 * 60 * 1000` (7 days in milliseconds).
