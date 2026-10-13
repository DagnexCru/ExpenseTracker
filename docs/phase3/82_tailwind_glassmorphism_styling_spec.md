# 82. Tailwind CSS Glassmorphism & Visual Aesthetics Specification

## 1. Aesthetic Direction
SpendWise adheres to the approved Phase 0 design tokens:
- **Surface Dark**: `bg-slate-900/90` with `backdrop-blur-md`
- **Border Subtle**: `border border-slate-700/60`
- **Primary Elevation**: `shadow-xl shadow-black/20`
- **Interactive Hover**: `hover:bg-slate-800/80 transition-all duration-200`

## 2. Component Design Tokens
### A. KPI Cards (`TransactionStatsMini.jsx`)
- Rounded corners: `rounded-2xl`
- Padding: `p-5`
- Subtitle: `text-xs font-semibold text-slate-400 uppercase tracking-wider`
- Numbers: `text-2xl font-bold tracking-tight font-mono`

### B. Form Inputs (`TransactionModal.jsx`)
- Input background: `bg-slate-950/70 border border-slate-700/80`
- Focus ring: `focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500`
- Placeholder: `placeholder-slate-500`

### C. Transaction Table (`TransactionTable.jsx`)
- Header row: `bg-slate-800/50 text-slate-400 text-xs font-semibold uppercase`
- Alternating rows: Smooth hover highlight `hover:bg-slate-800/40`
- Amount column: `font-mono font-medium text-right`
