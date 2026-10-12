# SpendWise Phase 2 — REST API Specification

## Base URL
- Development: `http://localhost:5000/api`
- Reverse Proxy: `/api` (via Vite on port 5173)

---

### 1. Register User
- **Method**: `POST`
- **Path**: `/api/auth/register`
- **Headers**: `Content-Type: application/json`
- **Request Body**:
```json
{
  "name": "Abebe Bikila",
  "email": "abebe.test@spendwise.et",
  "password": "Password123!",
  "currency": "ETB"
}
```
- **Success Response (201 Created)**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "670a23f890abcdef01234567",
      "name": "Abebe Bikila",
      "email": "abebe.test@spendwise.et",
      "currency": "ETB",
      "createdAt": "2026-10-12T20:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### 2. Login User
- **Method**: `POST`
- **Path**: `/api/auth/login`
- **Headers**: `Content-Type: application/json`
- **Request Body**:
```json
{
  "email": "abebe.test@spendwise.et",
  "password": "Password123!"
}
```
- **Success Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "670a23f890abcdef01234567",
      "name": "Abebe Bikila",
      "email": "abebe.test@spendwise.et",
      "currency": "ETB"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### 3. Get Current User Profile
- **Method**: `GET`
- **Path**: `/api/auth/me`
- **Headers**: `Authorization: Bearer <token>` or Cookie: `token=<jwt>`
- **Success Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "670a23f890abcdef01234567",
      "name": "Abebe Bikila",
      "email": "abebe.test@spendwise.et",
      "currency": "ETB"
    }
  }
}
```

---

### 4. Logout User
- **Method**: `POST`
- **Path**: `/api/auth/logout`
- **Success Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "message": "Logged out successfully"
  }
}
```
