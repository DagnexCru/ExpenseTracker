# SpendWise Authentication & Security Specification

This document details the authentication architecture, security safeguards, and token lifecycle implemented in Phase 2.

---

## 🛡️ Security Architecture

### 1. HTTP-Only Cookie Strategy
Instead of storing JSON Web Tokens (JWT) inside browser `localStorage` or `sessionStorage` (which are vulnerable to Cross-Site Scripting / XSS attacks), SpendWise transmits authentication tokens via **HTTP-only Cookies**:
- **`httpOnly: true`**: JavaScript running in the browser cannot read or steal `document.cookie`.
- **`secure: true`**: Enforced in production to ensure tokens are only transmitted over TLS/HTTPS.
- **`sameSite: 'lax'` (Dev) / `'strict'` (Prod)**: Protects state-changing endpoints against Cross-Site Request Forgery (CSRF).
- **`path: '/'`**: Cookie scope covers all `/api` endpoints.

---

## 🔑 Token Lifecycle

```
[Client: Browser / Postman]
       │
       ├─── 1. POST /api/auth/login { email, password }
       │
[Server: Express API]
       ├─── 2. bcrypt.compare(enteredPassword, storedHash)
       ├─── 3. jwt.sign({ id, email }, JWT_SECRET, { expiresIn: '7d' })
       │
[Client: Browser / Postman]
       ◄─── 4. Response 200 OK + Set-Cookie: token=<jwt>; HttpOnly; SameSite=Lax
       │
       ├─── 5. GET /api/auth/me (Cookie attached automatically by browser)
       │
[Server: Auth Guard]
       ├─── 6. protect middleware reads req.cookies.token
       ├─── 7. jwt.verify(token, JWT_SECRET)
       ├─── 8. User.findById(decoded.id)
       │
       ◄─── 9. Response 200 OK with User Profile DTO
```

---

## 🚫 Sensitive Field Guard
- Password hashes are stored using **bcrypt** with 10 salt rounds.
- Mongoose schema marks `password: { select: false }`.
- Schema transform `toJSON` deletes `password` and `__v` before any JSON response leaves the server.
