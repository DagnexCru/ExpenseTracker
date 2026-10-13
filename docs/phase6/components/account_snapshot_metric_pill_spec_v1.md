# Component Technical Specification: account_snapshot_metric_pill (v1)

### Component Name
`account_snapshot_metric_pill`

### Phase & Integration
- Phase: Phase 6 (User Profile and Currency Preferences)
- Framework: React 18 / Tailwind CSS
- Revision: 1

### Accessibility (a11y)
- Aria attributes: `aria-label`, `role="region"`, keyboard tab ordering.
- Contrast ratio: Passes WCAG 2.1 AA standards on neutral slate and brand surfaces.

### State Contracts
- Controlled components synchronized with parent query parameters and AuthContext.
- Smooth optimistic updates with error-rollback mechanisms.
