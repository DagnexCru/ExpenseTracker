/**
 * @file transaction.constants.js
 * @description Standardized transaction types, categories, and payment methods
 */

export const TRANSACTION_TYPES = Object.freeze({
  INCOME: 'income',
  EXPENSE: 'expense',
});

export const EXPENSE_CATEGORIES = Object.freeze([
  'Food & Dining',
  'Transportation',
  'Housing & Rent',
  'Utilities',
  'Healthcare',
  'Education',
  'Entertainment',
  'Shopping',
  'Personal Care',
  'Other Expense',
]);

export const INCOME_CATEGORIES = Object.freeze([
  'Salary',
  'Freelance & Consulting',
  'Business',
  'Investments',
  'Rental Income',
  'Gift & Grant',
  'Other Income',
]);

export const ALL_CATEGORIES = Object.freeze([
  ...EXPENSE_CATEGORIES,
  ...INCOME_CATEGORIES,
]);

export const PAYMENT_METHODS = Object.freeze([
  'cash',
  'bank_transfer',
  'mobile_money',
  'credit_card',
  'debit_card',
  'other',
]);

export const DEFAULT_PAYMENT_METHOD = 'cash';
