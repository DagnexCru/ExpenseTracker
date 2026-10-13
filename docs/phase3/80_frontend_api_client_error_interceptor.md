# 80. Frontend API Client & Error Interceptor Architecture

## 1. Overview
The frontend API client (`client/src/api/client.js`) configures an Axios instance with `withCredentials: true` and centralized interceptors for authentication and error recovery.

## 2. Request Interceptor
- Inspects `localStorage` for fallback Bearer tokens in non-cookie environments.
- Automatically attaches `Authorization: Bearer <token>` when present.
- Sets standard JSON content headers:
```javascript
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('spendwise_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

## 3. Response Error Interceptor
- Intercepts HTTP 401 Unauthorized errors.
- Prevents infinite redirect loops on public login/registration routes.
- Clears stale session state and invokes global session expiry handlers when appropriate.
```javascript
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Trigger session refresh or redirection if unauthenticated
    }
    return Promise.reject(error);
  }
);
```

## 4. CRUD Module Design
`client/src/api/transactions.js` abstracts all CRUD requests into clean async functions (`fetchTransactions`, `createTransaction`, `updateTransaction`, `deleteTransaction`).
