# SpendWise Phase 2 — Frontend Component Hierarchy

## 1. Component Tree Architecture

```
App.jsx (AuthProvider)
├── Navbar
│   ├── BrandLogo & Title
│   ├── HealthIndicator (Badge)
│   ├── CurrencyPill
│   ├── ProfileAvatar (when authenticated)
│   └── AuthNavigationButtons (when unauthenticated)
├── Sidebar
│   ├── RoadmapItems
│   ├── ProfileAvatar
│   └── DatabaseStatusBadge
└── Main Content Container
    ├── HealthCheckPage (Phase 1)
    ├── LoginPage (Phase 2)
    │   ├── Alert (Banner errors)
    │   ├── Input (Email)
    │   ├── PasswordInput
    │   ├── RememberMeCheckbox
    │   ├── DemoCredentialsButton
    │   └── Button (Submit)
    ├── RegisterPage (Phase 2)
    │   ├── Alert (Banner errors)
    │   ├── Input (Name, Email)
    │   ├── PasswordInput (Password, ConfirmPassword)
    │   ├── PasswordStrengthMeter
    │   ├── DemoCredentialsButton
    │   └── Button (Submit)
    └── UserProfileCard (Phase 2)
        ├── ProfileAvatar (Initials + Status Ring)
        ├── AccountDetailsGrid
        ├── LiveCookieVerification
        ├── CurrencySelector
        ├── SecurityAuditBadge
        ├── SecurityLogs
        └── PasswordChangeModal
```

## 2. Shared UI Library Components (`client/src/components/ui/`)
- `Alert.jsx`: Accessible dismissible banner with variants (info, success, warning, error).
- `Badge.jsx`: Compact pill with status dot (success, warning, danger, neutral).
- `Button.jsx`: Interactive button with loading spinner, variants, and icon slots.
- `Card.jsx`: Container card with header, title, description, and footer.
- `Input.jsx`: Floating/standard accessible text input with label and validation hints.
- `PasswordInput.jsx`: Password field with reveal toggle and built-in strength meter.
- `Modal.jsx`: Accessible modal dialog with backdrop blur and escape key listener.
- `Spinner.jsx`: Accessible animated SVG loader.
- `Tooltip.jsx`: Floating tooltip with hover/focus triggers.
