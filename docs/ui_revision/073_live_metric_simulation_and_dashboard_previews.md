# UI Revision Architecture Doc #73: LIVE METRIC SIMULATION AND DASHBOARD PREVIEWS
*SpendWise Personal Expense Tracker — UI Revision & Production Polish*
*Author: Senior Full-Stack MERN Architect & Mentor (Antigravity)*
*Revision: 2.73*

## 1. Executive Summary
This design and architecture reference documents **live metric simulation and dashboard previews** for the SpendWise Personal Expense Tracker application.
The newly introduced Home / Landing page establishes the initial brand touchpoint, providing visitors with clear product value, live metric visualizations, feature breakdowns, and frictionless onboarding entry points into authentication and dashboard exploration.

## 2. Design System & UI Specifications
- **Hero Typography**: Bold, clean sans-serif typography utilizing modern tracking and visual line-height proportion.
- **Color Palettes**: Curated slate-900 dark hero contrast paired with emerald positive cashflow accents, rose expense tags, and indigo brand badges.
- **Glassmorphism & Lighting**: Multi-layered backdrop blurs (`backdrop-blur-md`), ambient radial gradients, and subtle border highlights (`border-slate-800/80`).
- **Responsive Fluidity**: Complete layout adaptability across single-column mobile viewports (360px–640px), dual-column tablet displays (768px), and full-width desktop monitors (1024px–1440px).

## 3. Component Hierarchy
1. **Navbar Integration**: SpendWise logo button triggers immediate return to `'home'` view; explicit "Home" quick-link provided.
2. **Hero Presentation**: High-contrast headline, product description, and dual primary CTA buttons (*"Create Free Account"*, *"Sign In"*).
3. **Live Metric Cards**: Simulated cashflow summary (+50,000 ETB Inflow, -6,600 ETB Outflow, +43,400 ETB Net Operating Balance).
4. **Feature Grid**: 6 modular capability cards detailing Aggregations, Live Ledger CRUD, Query Engine, Security, Currencies, and Diagnostics.
5. **3-Step Lifecycle**: Visual walk-through of transaction recording, trend analysis, and budgeting optimization.
6. **Conversion Banner & Footer**: Global CTA footer linking directly to user registration and ledger views.

## 4. Verification Check
- Component compilation: Verified via Vite build (0 warnings/errors).
- Navigation state parity: Confirmed across Navbar, Sidebar, and App dynamic router.
