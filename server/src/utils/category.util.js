/**
 * @file category.util.js
 * @description Helper functions to validate category affinity with transaction type
 */

import {
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
  TRANSACTION_TYPES,
} from '../constants/transaction.constants.js';

/**
 * Validates whether a category is valid for a given transaction type.
 *
 * @param {string} type - 'income' | 'expense'
 * @param {string} category - Category name
 * @returns {boolean}
 */
export const isValidCategoryForType = (type, category) => {
  if (!type || !category) return false;

  if (type === TRANSACTION_TYPES.EXPENSE) {
    return EXPENSE_CATEGORIES.includes(category);
  }

  if (type === TRANSACTION_TYPES.INCOME) {
    return INCOME_CATEGORIES.includes(category);
  }

  return false;
};

/**
 * Returns allowed categories for a given transaction type.
 *
 * @param {string} type
 * @returns {string[]}
 */
export const getCategoriesForType = (type) => {
  if (type === TRANSACTION_TYPES.INCOME) {
    return [...INCOME_CATEGORIES];
  }
  return [...EXPENSE_CATEGORIES];
};
