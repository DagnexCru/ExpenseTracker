# SpendWise — Personal Expense Tracker (MERN Stack)

A professional, full-stack Personal Expense Tracker built with modern engineering best practices, robust security standards, and an intuitive SaaS design system.

---

## 🛠️ Technology Stack

- **Frontend:** React 19 / Vite, Tailwind CSS, Lucide Icons, Axios, Recharts
- **Backend:** Node.js, Express.js, Mongoose
- **Database:** MongoDB (Local / Atlas)
- **Authentication:** JWT via HTTP-only Secure Cookies, bcrypt password hashing
- **Testing:** Automated API testing & Postman integration suites

---

## 🏗️ Project Architecture

```
ExpenseTracker/
├── server/             # Express.js REST API
│   ├── src/
│   │   ├── config/     # Database & environment configurations
│   │   ├── controllers/# API route controllers
│   │   ├── middleware/ # Centralized error & auth handling
│   │   ├── models/     # Mongoose data schemas (User, Transaction)
│   │   ├── routes/     # Versioned REST API endpoints (/api)
│   │   ├── services/   # Business logic & query aggregation
│   │   ├── validators/ # Input payload schema validators
│   │   ├── app.js      # Express application setup
│   │   └── server.js   # HTTP server & database bootstrapper
├── client/             # React + Vite Frontend
│   ├── src/
│   │   ├── api/        # Axios HTTP client configuration
│   │   ├── components/ # Reusable UI components & layouts
│   │   ├── context/    # Authentication & Currency state
│   │   ├── pages/      # Route view pages
│   │   ├── App.jsx     # App entry & router
│   │   └── main.jsx    # React DOM root
└── README.md
```

---

## 🚀 Phase-by-Phase Roadmap

1. **Phase 0:** Workspace Inspection & Architecture Planning ✅
2. **Phase 1:** Backend Foundation & Frontend Application Shell ⏳ (In Progress)
3. **Phase 2:** User Model, Authentication & Protected Routes
4. **Phase 3:** Transaction Data Model & Core CRUD
5. **Phase 4:** Dashboard Analytics, Summary & Visualizations
6. **Phase 5:** Transaction Filtering, Sorting & Pagination
7. **Phase 6:** User Profile & Currency Preferences (ETB Default)
8. **Phase 7:** Validation, Security Hardening & Automated Tests
9. **Phase 8:** Final Polish & End-to-End Verification
10. **Phase 9:** Production Deployment Readiness & Documentation

---

## 💻 Local Development Setup

### Prerequisites
- Node.js (v20+ recommended, current: v25)
- MongoDB running locally on `localhost:27017` or MongoDB Atlas URI
- Git

### Installation & Execution (Git Bash)
```bash
# Clone the repository
git clone https://github.com/DagnexCru/ExpenseTracker.git
cd ExpenseTracker

# Install dependencies (Phase 1+)
npm run install:all

# Run backend development server
npm run dev:server

# Run frontend development server
npm run dev:client
```
