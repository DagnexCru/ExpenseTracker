# 79. Transaction Controller Error Boundaries & Standardized Payloads

## 1. Architectural Philosophy
SpendWise employs a clean separation of concerns:
- **Routes (`routes/transaction.routes.js`)**: Declare HTTP verb endpoints, bind route middleware, and route requests.
- **Validators (`validators/transaction.validator.js`)**: Intercept malformed input before controller invocation.
- **Controllers (`controllers/transaction.controller.js`)**: Handle HTTP serialization, parse parameters, and catch unhandled exceptions.
- **Services (`services/transaction.service.js`)**: Implement business logic and database queries.

## 2. Standardized JSON Envelope
All API responses adhere strictly to the standardized envelope structure:
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Transactions retrieved successfully",
  "count": 5,
  "data": {
    "transactions": [...]
  }
}
```

In the event of an error:
```json
{
  "success": false,
  "statusCode": 404,
  "message": "Transaction not found or unauthorized",
  "error": {
    "code": "TRANSACTION_NOT_FOUND"
  }
}
```

## 3. Centralized Error Propagation
Controller functions wrap asynchronous operations in `try...catch` blocks and forward unhandled exceptions to `next(err)`, allowing the centralized error middleware (`middleware/error.middleware.js`) to log and sanitize errors.
