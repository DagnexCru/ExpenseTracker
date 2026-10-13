# SpendWise — Production Cookie Security Checklist

- [x] `httpOnly: true` — Block client JavaScript access via `document.cookie`
- [x] `sameSite: 'lax'` — Mitigate Cross-Site Request Forgery (CSRF)
- [x] `secure: process.env.NODE_ENV === 'production'` — Enforce HTTPS transmission in production
- [x] `maxAge: 7 * 24 * 60 * 60 * 1000` — Expire session cookie after 7 days
- [x] `path: '/'` — Cookie scope applies across entire API namespace
