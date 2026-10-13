# SpendWise — JWT Claims Structure & Security Standards

## Standard Claims Payload
```json
{
  "id": "670a23f890abcdef01234567",
  "iat": 1697059200,
  "exp": 1697664000
}
```

## Security Design Choices
- **Minimal Surface:** Only the MongoDB document `_id` is stored in the token.
- **No Sensitive PII:** Passwords, email, names, or roles are deliberately omitted from the JWT payload to eliminate information leakage if decoded client-side.
- **Signature Algorithm:** Standard HMAC with SHA-256 (`HS256`).
