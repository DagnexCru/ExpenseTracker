# Profile Architecture & UI Specification #13: LOCAL STORAGE AVATAR CACHE AND SESSION RESTORE
*SpendWise Personal Expense Tracker — User Profile & Form Field Design System*
*Author: Senior Full-Stack MERN Architect (Antigravity)*
*Revision: 6.13*

## 1. Feature Context & Requirements
- **Circular Profile Avatar**: The user's profile image follows a pure circular shape (`rounded-full`) matching standard modern design patterns (Google, Apple, Slack). It includes a subtle outer ring (`ring-1 ring-slate-200/60`) and white border for visual distinction on both light and tinted backgrounds.
- **Display Name Input Clearance**: In `Input.jsx`, when an icon (such as `UserIcon`) is prepended inside the input container, the left padding is calibrated to `pl-11` (44px) so that user-entered text (e.g. "Abebe") is rendered with 14px of clear margin from the 16px icon, preventing any visual overlap or clipping.
- **Interactive Profile Badges**: Quick information badges and currency switchers respond fluidly to cursor hover with micro-elevation, subtle border lighting, and smooth color transitions.

## 2. Technical Implementation Details
- **Component**: `ProfileAvatar.jsx`
- **Modal Component**: `EditProfilePhotoModal.jsx`
- **Form Component**: `Input.jsx`
- **Page Container**: `UserProfileCard.jsx`
- **Preset Avatars**: Updated SVG vector paths use `<circle cx="50" cy="50" r="50" .../>` for 100% circular consistency without square clipping artifacts.

## 3. Verification & Compliance
- Builds cleanly with `npm run build` (Vite bundle generated in ~7s with code 0).
- Compatible with all dashboard layouts, responsive mobile viewports, and high-DPI displays.
