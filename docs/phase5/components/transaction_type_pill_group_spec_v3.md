# Component Technical Specification: transaction_type_pill_group (v3)

### Component Name
`transaction_type_pill_group`

### Phase & Integration
- Phase: Phase 5 (Transaction Search, Filtering, Sorting, and Pagination)
- Framework: React 18 / Tailwind CSS
- Revision: 3

### Accessibility (a11y)
- Aria attributes: `aria-label`, `role="navigation"`, keyboard tab ordering.
- Contrast ratio: Passes WCAG 2.1 AA standards on dark slate backgrounds.

### State Contracts
- Controlled components synchronized with parent query parameters.
- URL and local state resilience during asynchronous network fetches.
