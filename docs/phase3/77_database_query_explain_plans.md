# 77. MongoDB Query Explain Plans & Compound Index Selectivity

## 1. Overview
In SpendWise Phase 3, query efficiency is critical as the `transactions` collection grows. Every transaction query is scoped to the authenticated user ID (`req.user.id`).

## 2. Compound Index Strategy
The Mongoose `Transaction` schema specifies three targeted compound indexes:
```javascript
transactionSchema.index({ user: 1, date: -1 });
transactionSchema.index({ user: 1, type: 1 });
transactionSchema.index({ user: 1, category: 1 });
```

## 3. Query Execution Plan (Explain Output)
When executing `Transaction.find({ user: userId }).sort({ date: -1 })`:
- **Winning Plan**: `IXSCAN` on `{ user: 1, date: -1 }`
- **Total Keys Examined**: Equal to number of transactions returned
- **Total Documents Examined**: Equal to number of transactions returned
- **Sort Stage**: Avoided in memory (`SORT` stage is absent because the index provides B-Tree ordered traversal)

## 4. Index Selectivity
- User ID provides high cardinal selectivity, isolating tenancy in $O(\log N)$ time.
- Reverse date ordering allows the database engine to stream results immediately without loading entire result sets into memory.
