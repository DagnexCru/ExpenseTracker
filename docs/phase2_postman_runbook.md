# SpendWise Phase 2 — Postman Manual & Automated Testing Runbook

This runbook guides engineers and evaluators through verifying all Phase 2 endpoints using Postman or cURL.

## Prerequisites
1. Express backend running on `http://localhost:5000`.
2. Local MongoDB service active on `mongodb://localhost:27017/expensetracker`.

---

## Request 1: User Registration (`POST /api/auth/register`)
- **Method**: `POST`
- **URL**: `http://localhost:5000/api/auth/register`
- **Body (raw JSON)**:
```json
{
  "name": "Abebe Bikila",
  "email": "abebe.test@spendwise.et",
  "password": "Password123!",
  "currency": "ETB"
}
```
- **Postman Tests Script**:
```javascript
pm.test("Status code is 201 Created", function () {
    pm.response.to.have.status(201);
});
pm.test("Response contains token and user object", function () {
    const json = pm.response.json();
    pm.expect(json.success).to.eql(true);
    pm.expect(json.data.token).to.be.a('string');
    pm.expect(json.data.user.email).to.eql("abebe.test@spendwise.et");
    pm.expect(json.data.user.password).to.be.undefined;
    pm.environment.set("authToken", json.data.token);
});
```

---

## Request 2: User Login (`POST /api/auth/login`)
- **Method**: `POST`
- **URL**: `http://localhost:5000/api/auth/login`
- **Body (raw JSON)**:
```json
{
  "email": "abebe.test@spendwise.et",
  "password": "Password123!"
}
```
- **Postman Tests Script**:
```javascript
pm.test("Status code is 200 OK", function () {
    pm.response.to.have.status(200);
});
pm.test("Login returns valid JWT token", function () {
    const json = pm.response.json();
    pm.expect(json.success).to.eql(true);
    pm.expect(json.data.token).to.be.a('string');
    pm.environment.set("authToken", json.data.token);
});
```

---

## Request 3: Get User Profile (`GET /api/auth/me`)
- **Method**: `GET`
- **URL**: `http://localhost:5000/api/auth/me`
- **Headers**:
  - `Authorization`: `Bearer {{authToken}}`
- **Postman Tests Script**:
```javascript
pm.test("Status code is 200 OK", function () {
    pm.response.to.have.status(200);
});
pm.test("Profile matches authenticated user", function () {
    const json = pm.response.json();
    pm.expect(json.success).to.eql(true);
    pm.expect(json.data.user.email).to.eql("abebe.test@spendwise.et");
});
```

---

## Request 4: User Logout (`POST /api/auth/logout`)
- **Method**: `POST`
- **URL**: `http://localhost:5000/api/auth/logout`
- **Postman Tests Script**:
```javascript
pm.test("Status code is 200 OK", function () {
    pm.response.to.have.status(200);
});
pm.test("Response confirms logout", function () {
    const json = pm.response.json();
    pm.expect(json.success).to.eql(true);
    pm.expect(json.data.message).to.eql("Logged out successfully");
});
```
