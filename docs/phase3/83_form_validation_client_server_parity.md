# 83. Client & Server Form Validation Parity

## 1. Principles of Dual-Layer Validation
To ensure high responsiveness and absolute backend security, SpendWise implements identical validation rules on both the React frontend and Express backend.

## 2. Validation Parity Table
| Field | Client Validation (`TransactionModal.jsx`) | Server Validation (`transaction.validator.js`) |
| :--- | :--- | :--- |
| `type` | Radio pill selector restricted to `income` or `expense` | Enforced enum: `['income', 'expense']` |
| `amount` | Must be numeric, $> 0$, and $\le 1,000,000,000$ | `typeof amount === 'number'`, $> 0$, $\le 10^9$ |
| `category` | Filtered dropdown by active type | `isValidCategoryForType(category, type)` |
| `date` | Valid ISO date string; defaults to today | `!isNaN(new Date(date).getTime())` |
| `description` | Optional text; truncated to 200 characters | Optional string; `max: 200` characters |
| `paymentMethod` | Dropdown matching predefined enum | Optional enum: `cash`, `bank_transfer`, `card`, `mobile_money`, `other` |

## 3. User Feedback Workflow
- Client-side validation stops form submission instantly before network overhead occurs, displaying inline field error labels.
- If a client bypasses UI validation, the server validator intercepts the request, returning HTTP 400 Bad Request with a clear error payload.
