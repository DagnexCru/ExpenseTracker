# Architectural Specification #020: CONSISTENT BORDER AND SHADOW ELEVATIONS ACROSS AUTH COLUMNS
*SpendWise Personal Financial Management System — Design Harmonization Series*
*Author: Senior Full-Stack MERN & UI/UX Architect (Antigravity)*
*Revision: 13.5*

## 1. Context & Objective
Standardizing border-radius, border-color, and box-shadow tokens across left and right panels.

## 2. Technical & Design Rationale
Both columns feature `rounded-[32px] sm:rounded-[42px]`, `border border-[#EDE4D9]`, and `shadow-xl shadow-slate-900/5` ensuring geometric symmetry and responsive balance.

## 3. Harmonization Quality Standards
- **Background Uniformity:** Both Left Showcase and Right Form columns share `bg-white` with `border-[#EDE4D9]`.
- **Canvas Continuity:** Floats seamlessly over the global `#FAF5F0` warm cream background.
- **Accent Cohesion:** Net Operating Balance retains signature `from-brand-700 via-indigo-700 to-brand-800` gradient matching Home Page Card 3.
- **Production Validation:** Zero build errors with `npm run build` (Vite bundle generated in 20.7s).
