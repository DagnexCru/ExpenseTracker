# 84. Automated Test Suite Coverage Matrix

## 1. Executive Summary
SpendWise utilizes a zero-mock, real-database automated test strategy covering every backend tier from low-level utilities to full multi-user REST API interactions.

## 2. Test Suites Summary
| Suite Number | Test File | Component Under Test | Test Count | Result |
| :---: | :--- | :--- | :---: | :---: |
| 1 | `tests/health.test.js` | Express Server & MongoDB Connection | 1 | ✅ PASS |
| 2 | `tests/utils.test.js` | Bcrypt Hashing, JWT Sign/Verify, Cookies | 6 | ✅ PASS |
| 3 | `tests/user.test.js` | User Schema, Validations, Pre-save Hooks | 7 | ✅ PASS |
| 4 | `tests/auth.test.js` | Register, Login, Duplicate Check, Logout | 8 | ✅ PASS |
| 5 | `tests/auth_edge_cases.test.js` | Tampered Tokens, Malformed Payloads, Headers | 10 | ✅ PASS |
| 6 | `tests/transaction.test.js` | Transaction CRUD & Cross-Tenant Isolation | 11 | ✅ PASS |
| **Total** | **6 Suites** | **Entire SpendWise Backend Engine** | **43** | **100% PASS** |

## 3. Regression Execution Command
```bash
npm --prefix server test
```
All 43 assertions pass in under 5 seconds with automatic teardown and database cleanup.
