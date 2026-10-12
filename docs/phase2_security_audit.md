# SpendWise Phase 2 — Security Audit & OWASP Top 10 Compliance

This document verifies the security implementations of the SpendWise authentication subsystem against industry standards.

## 1. Password Storage & Cryptographic Hashing
- **Algorithm**: `bcryptjs`
- **Cost Factor**: 10 salt rounds (`bcrypt.genSalt(10)`)
- **Pre-save Hook**: Uses `this.isModified('password')` in `server/src/models/User.js` to ensure password re-hashing only occurs on registration or deliberate password alteration.
- **Timing Attack Resistance**: Uses `bcrypt.compare` to mitigate timing analysis side-channels.

## 2. Information Disclosure Prevention
- **Schema `toJSON` Transform**: Automatically strips `password` and internal fields (`__v`) whenever a user document is serialized into JSON.
- **Uniform Error Messages**: Login endpoint returns identical 401 `INVALID_CREDENTIALS` responses for both non-existent emails and incorrect passwords, preventing user enumeration attacks.

## 3. Session & Transport Security
- **Cookie Flags**:
  - `HttpOnly`: Mitigates XSS credential theft.
  - `SameSite=Lax`: Mitigates Cross-Site Request Forgery (CSRF).
  - `Secure`: Dynamically set to `true` when `NODE_ENV === 'production'`.
- **CORS Configuration**: Restricts origins to trusted frontend domains (`http://localhost:5173`) with `credentials: true`.

## 4. Input Sanitization & Validation
- **Email Normalization**: Lowercased and trimmed before database lookups to prevent case-variation duplicates.
- **Length Limits**: Full name bounded between 2 and 50 characters. Password minimum 6 characters.
- **Currency Enum**: Whitelisted against supported currencies (`['ETB', 'USD', 'EUR', 'GBP']`).
