# 81. Transaction KPI Metric Formulas & Calculation Reference

## 1. Overview
In SpendWise Phase 3, the `TransactionStatsMini` component displays four live financial metric cards derived from the user's active transaction dataset:
1. **Net Balance**
2. **Total Income**
3. **Total Expenses**
4. **Total Records**

## 2. Mathematical Formulas
Let $T$ be the set of transactions belonging to the authenticated user.
Let $T_{income} = \{ t \in T \mid t.type = \text{'income'} \}$.
Let $T_{expense} = \{ t \in T \mid t.type = \text{'expense'} \}$.

### A. Total Income:
$$\text{Total Income} = \sum_{t \in T_{income}} t.amount$$

### B. Total Expenses:
$$\text{Total Expenses} = \sum_{t \in T_{expense}} t.amount$$

### C. Net Balance:
$$\text{Net Balance} = \text{Total Income} - \text{Total Expenses}$$

### D. Total Records:
$$\text{Total Records} = |T|$$

## 3. Monetary Precision Policy
All floating point additions apply fixed 2-decimal truncation to prevent IEEE 754 precision artifacts (such as `0.1 + 0.2 = 0.30000000000000004`):
```javascript
const netBalance = Math.round((totalIncome - totalExpenses) * 100) / 100;
```

## 4. UI Rendering Conventions
- **Positive Net Balance**: Displayed with emerald green accent (`text-emerald-400`).
- **Negative Net Balance**: Displayed with rose accent (`text-rose-400`).
- **Zero Balance**: Displayed with slate neutral styling (`text-slate-200`).
