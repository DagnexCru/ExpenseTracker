# SpendWise Phase 2 — JWT Lifecycle Sequence Diagram

```mermaid
sequenceDiagram
    autonumber
    actor User as User Browser
    participant Client as React Client (Port 5173)
    participant Server as Express Server (Port 5000)
    participant DB as MongoDB Atlas / Local

    User->>Client: Enters Credentials (Email & Password)
    Client->>Server: POST /api/auth/login { email, password }
    Server->>DB: User.findOne({ email: normalizedEmail })
    DB-->>Server: Return User Document (incl. password hash)
    Server->>Server: bcrypt.compare(plainPassword, passwordHash)
    alt Password Invalid
        Server-->>Client: 401 Unauthorized { success: false, code: "INVALID_CREDENTIALS" }
        Client-->>User: Display Error Banner
    else Password Valid
        Server->>Server: jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' })
        Server-->>Client: 200 OK + Set-Cookie: token=jwt; HttpOnly; SameSite=Lax
        Client->>Client: Save user object in AuthContext state
        Client-->>User: Navigate to Dashboard / UserProfileCard
    end

    Note over Client,Server: Subsequent Protected Requests (e.g. GET /api/auth/me)
    Client->>Server: GET /api/auth/me (Cookie automatically attached by browser)
    Server->>Server: jwt.verify(cookie.token, JWT_SECRET)
    Server->>DB: User.findById(decoded.id).select('-password')
    DB-->>Server: Return User Profile
    Server-->>Client: 200 OK { success: true, data: { user } }
```
