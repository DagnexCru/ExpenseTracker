# SpendWise — HTTP Status Code & Error Payload Matrix

| Endpoint | HTTP Status | Code | Description |
|---|---|---|---|
| `POST /api/auth/register` | 400 | `VALIDATION_ERROR` | Malformed email, short password, missing name |
| `POST /api/auth/register` | 409 | `EMAIL_ALREADY_EXISTS` | Duplicate email address registration attempt |
| `POST /api/auth/login` | 400 | `VALIDATION_ERROR` | Missing email or password in request body |
| `POST /api/auth/login` | 401 | `INVALID_CREDENTIALS` | Incorrect password or unassociated email |
| `GET /api/auth/me` | 401 | `UNAUTHORIZED` | Missing both cookie and Bearer token |
| `GET /api/auth/me` | 401 | `INVALID_TOKEN` | Tampered token signature or expired token |
