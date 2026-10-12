# SpendWise Phase 2 — Postman Assertion Snippets Cheatsheet

```javascript
// Status code check
pm.test("Status code is 200", () => pm.response.to.have.status(200));

// JSON structure check
pm.test("Success flag is true", () => {
    const res = pm.response.json();
    pm.expect(res.success).to.eql(true);
});

// Cookie header verification
pm.test("Set-Cookie header includes HttpOnly", () => {
    const header = pm.response.headers.get("Set-Cookie");
    pm.expect(header).to.include("HttpOnly");
});

// Environment variable setting
pm.environment.set("authToken", pm.response.json().data.token);
```
