# SpendWise Phase 2 — HTTP Cookie Security Deep-Dive

## Why HTTP-Only Cookies Over localStorage?

Storing authentication tokens (JWTs) in browser `localStorage` exposes them to any JavaScript running on the page. In the event of a Cross-Site Scripting (XSS) vulnerability, an attacker can trivially steal tokens using `localStorage.getItem('token')`.

By configuring tokens inside **HTTP-Only Cookies**:
1. `document.cookie` cannot read the token from client-side scripts.
2. The browser automatically handles attaching the cookie to every subsequent cross-origin or same-origin request.
3. The `SameSite=Lax` attribute protects against Cross-Site Request Forgery (CSRF).

## Header Verification
```http
Set-Cookie: token=eyJhbGciOiJIUzI1Ni...; Path=/; Expires=Sun, 19 Oct 2026 20:00:00 GMT; HttpOnly; SameSite=Lax
```
