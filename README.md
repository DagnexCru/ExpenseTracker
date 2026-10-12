# SpendWise — Personal Expense Tracker (MERN Stack)

A professional, full-stack Personal Expense Tracker built with modern engineering best practices, robust security standards, and an intuitive SaaS design system.

---

## 🛠️ Technology Stack

- **Frontend:** React 19 / Vite, Tailwind CSS, Lucide Icons, Axios
- **Backend:** Node.js, Express.js, Mongoose 8
- **Database:** MongoDB (Local / Atlas)
- **Authentication:** JWT via HTTP-only Secure Cookies + Bearer Authorization, bcrypt password hashing (10 salt rounds)
- **Testing:** Native Node test runner (`node:test`), Supertest, and Postman v2.1 collection suites

---

## 🏗️ Project Architecture

```
ExpenseTracker/
├── server/                     # Express.js REST API
│   ├── src/
│   │   ├── config/             # Database & environment configurations
│   │   ├── controllers/        # Route controllers (auth, health)
│   │   ├── middleware/         # Centralized error, auth guard, rate limiter
│   │   ├── models/             # Mongoose schemas (User, Transaction)
│   │   ├── routes/             # Versioned REST API endpoints (/api)
│   │   ├── services/           # Business logic & query aggregation
│   │   ├── utils/              # JWT, bcrypt, cookie, sanitizer helpers
│   │   ├── validators/         # Input payload schema validators
│   │   ├── app.js              # Express application setup
│   │   └── server.js           # HTTP server & database bootstrapper
│   ├── tests/
│   │   ├── fixtures/           # Standardized test payloads
│   │   ├── integration/        # 18 end-to-end endpoint tests
│   │   ├── unit/               # 15 isolated utility & schema tests
│   │   └── auth_edge_cases.test.js # Security edge case suites
│   └── postman/                # Automated Postman collection & environment
├── client/                     # React + Vite Frontend
│   ├── src/
│   │   ├── api/                # Axios HTTP client configuration
│   │   ├── components/         # Reusable UI library, auth & layout components
│   │   ├── context/            # Global AuthContext & session state
│   │   ├── hooks/              # useAuth hook
│   │   ├── pages/              # HealthCheckPage, LoginPage, RegisterPage, UserProfileCard
│   │   ├── utils/              # Password strength, avatar, validation
│   │   ├── App.jsx             # Root application & session router
│   │   └── main.jsx            # React DOM root
├── docs/                       # Technical architecture & security specifications
└── README.md
```

---

## 🚀 Phase-by-Phase Roadmap

1. **Phase 0:** Workspace Inspection & Architecture Planning ✅ (Completed)
2. **Phase 1:** Backend Foundation & Frontend Application Shell ✅ (Completed & Verified)
3. **Phase 2:** User Model, Authentication & Protected Routes ✅ (Completed & Verified)
4. **Phase 3:** Transaction Data Model & Core CRUD ⏳ (Pending Approval)
5. **Phase 4:** Dashboard Analytics, Summary & Visualizations
6. **Phase 5:** Transaction Filtering, Sorting & Pagination
7. **Phase 6:** User Profile & Currency Preferences (ETB Default)
8. **Phase 7:** Validation, Security Hardening & Automated Tests
9. **Phase 8:** Final Polish & End-to-End Verification
10. **Phase 9:** Production Deployment Readiness & Documentation

---

## 💻 Local Development Setup

### Prerequisites
- Node.js (v20+ recommended)
- MongoDB running locally on `localhost:27017`
- Git

### Installation & Execution (Git Bash)
```bash
# Clone the repository
git clone https://github.com/DagnexCru/ExpenseTracker.git
cd ExpenseTracker

# Install dependencies
npm run install:all

# Run both backend (port 5000) and frontend (port 5173) simultaneously:
npm run dev
```

### Running Test Suites
```bash
# Run backend test suite
npm --prefix server test

# Verify frontend build
npm --prefix client run build
```
