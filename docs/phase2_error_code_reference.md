# SpendWise Phase 2 — API Error Code Reference

| Error Code | HTTP Status | Trigger Condition | Example Mitigation |
|---|---|---|---|
| `VALIDATION_ERROR` | `400 Bad Request` | Missing field, invalid email regex, password < 6 chars | Check `error.details` for field-level errors |
| `EMAIL_ALREADY_EXISTS` | `409 Conflict` | Attempting to register an email already in MongoDB | Use a different email or sign in directly |
| `INVALID_CREDENTIALS` | `401 Unauthorized` | Incorrect password or unassociated email | Double check email spelling and password |
| `UNAUTHORIZED` | `401 Unauthorized` | Missing both cookie and Bearer Authorization header | Provide valid session cookie or token |
| `INVALID_TOKEN` | `401 Unauthorized` | Tampered signature or expired JWT token | Re-authenticate to obtain fresh token |
| `RATE_LIMIT_EXCEEDED` | `429 Too Many Requests` | More than 100 requests in 15 minutes from single IP | Wait for retry timer to expire |
