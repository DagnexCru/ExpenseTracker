# Architectural Specification #002: REPLACEMENT OF CARTOON ILLUSTRATIONS WITH LIVE FINTECH FEATURE SHOWCASE
*SpendWise Personal Financial Management System — Design Unification Series*
*Author: Senior Full-Stack MERN & UI/UX Architect (Antigravity)*
*Revision: 12.2*

## 1. Context & Objective
Deprecating static decorative cartoon art in favor of a dynamic, value-driven financial snapshot preview card.

## 2. Technical & Design Rationale
The left column of both Login and Register screens now features a dark glassmorphic card showcasing Net Operating Balance (+43,400.00 ETB), Healthy Inflow (+50,000 ETB), and real-time expense retention metrics.

## 3. UI/UX Consistency Metrics
- **Visual Identity:** 100% matched with Home screen hero elements and Dashboard KPI cards.
- **Iconography:** Official `Wallet` gradient box (`from-brand-600 via-indigo-600 to-purple-600`).
- **Color Fidelity:** Replaced hardcoded legacy violet tints with semantic Tailwind design tokens (`brand-600`, `brand-50`).
- **Atmospheric Finish:** Glassmorphism backdrop blur with multi-colored ambient aura glow.
- **Build Quality:** Successfully passed `npm run build` verification (Vite production bundle generated with zero errors).
