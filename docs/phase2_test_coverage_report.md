# SpendWise Phase 2 — Test Coverage & Verification Summary

This document summarizes the automated test coverage for Phase 2 authentication across backend and frontend.

## 1. Backend Test Suites

### Unit Tests (`server/tests/unit/`)
| Test File | Description | Assertions | Result |
|---|---|---|---|
| `password_hashing.test.js` | Verifies bcrypt 10 salt rounds | 1 | PASS |
| `password_comparison.test.js` | Verifies password match and rejection | 2 | PASS |
| `jwt_generation.test.js` | Verifies signed token generation | 1 | PASS |
| `jwt_verification.test.js` | Verifies JWT verification and payload decoding | 1 | PASS |
| `cookie_options.test.js` | Verifies SameSite, maxAge, and HttpOnly options | 4 | PASS |
| `email_regex.test.js` | Verifies email pattern matching | 2 | PASS |
| `password_length.test.js` | Verifies 6 character minimum boundary | 2 | PASS |
| `user_currency.test.js` | Verifies currency enum constraints | 2 | PASS |
| `name_length.test.js` | Verifies 2-50 character boundaries | 2 | PASS |
| `toJSON_sanitization.test.js` | Verifies password exclusion from JSON | 2 | PASS |
| `sanitizer.test.js` | Verifies email/name whitespace and tag stripping | 4 | PASS |
| `password_entropy.test.js` | Verifies password scoring and label mapping | 4 | PASS |
| `token_blacklist.test.js` | Verifies token revocation and clearing | 3 | PASS |
| `rate_limiter.test.js` | Verifies request counting and 429 status code | 2 | PASS |
| `validator_middleware.test.js` | Verifies higher-order middleware pipeline | 3 | PASS |

### Integration Tests (`server/tests/integration/`)
| Test File | Endpoint Tested | Expected Status | Result |
|---|---|---|---|
| `01_register_success.test.js` | `POST /api/auth/register` | 201 Created | PASS |
| `02_register_duplicate.test.js` | `POST /api/auth/register` | 409 Conflict | PASS |
| `03_register_missing_name.test.js` | `POST /api/auth/register` | 400 Bad Request | PASS |
| `04_register_short_name.test.js` | `POST /api/auth/register` | 400 Bad Request | PASS |
| `05_register_long_name.test.js` | `POST /api/auth/register` | 400 Bad Request | PASS |
| `06_register_invalid_email.test.js` | `POST /api/auth/register` | 400 Bad Request | PASS |
| `07_register_short_password.test.js` | `POST /api/auth/register` | 400 Bad Request | PASS |
| `08_register_default_currency.test.js` | `POST /api/auth/register` | 201 Created (ETB) | PASS |
| `09_register_custom_currency.test.js` | `POST /api/auth/register` | 201 Created (USD) | PASS |
| `10_login_success.test.js` | `POST /api/auth/login` | 200 OK | PASS |
| `11_login_wrong_password.test.js` | `POST /api/auth/login` | 401 Unauthorized | PASS |
| `12_login_nonexistent_email.test.js` | `POST /api/auth/login` | 401 Unauthorized | PASS |
| `13_login_missing_fields.test.js` | `POST /api/auth/login` | 400 Bad Request | PASS |
| `14_get_me_cookie.test.js` | `GET /api/auth/me` | 200 OK | PASS |
| `15_get_me_bearer.test.js` | `GET /api/auth/me` | 200 OK | PASS |
| `16_get_me_unauthorized.test.js` | `GET /api/auth/me` | 401 Unauthorized | PASS |
| `17_get_me_tampered_token.test.js` | `GET /api/auth/me` | 401 Unauthorized | PASS |
| `18_logout_flow.test.js` | `POST /api/auth/logout` | 200 OK | PASS |

### Security Edge Cases (`server/tests/auth_edge_cases.test.js`)
- 10 automated test suites covering malformed JSON, SQL/NoSQL injection attempts, invalid HTTP verbs, headers, and token tampering.

## 2. Frontend Test Suites (`client/src/tests/`)
- `validation.test.js`: Verifies client form validation functions.
- `passwordStrength.test.js`: Verifies password scoring and feedback checklist.
