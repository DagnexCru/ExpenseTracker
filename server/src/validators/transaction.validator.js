/**
 * @file transaction.validator.js
 * @description Input payload validators for transaction CRUD operations
 */

import {
  TRANSACTION_TYPES,
  PAYMENT_METHODS,
  ALL_CATEGORIES,
} from '../constants/transaction.constants.js';
import { isValidCategoryForType } from '../utils/category.util.js';
import { isValidAmount } from '../utils/amount.util.js';
import { isValidDate } from '../utils/date.util.js';

/**
 * Validates request payload for creating a transaction.
 *
 * @param {Object} data
 * @returns {{ isValid: boolean, errors: Array<{ field: string, message: string }> }}
 */
export const validateCreateTransaction = (data = {}) => {
  const errors = [];

  // Type validation
  if (!data.type) {
    errors.push({ field: 'type', message: 'Transaction type is required.' });
  } else if (![TRANSACTION_TYPES.INCOME, TRANSACTION_TYPES.EXPENSE].includes(data.type)) {
    errors.push({ field: 'type', message: 'Transaction type must be either income or expense.' });
  }

  // Amount validation
  if (data.amount === undefined || data.amount === null || data.amount === '') {
    errors.push({ field: 'amount', message: 'Transaction amount is required.' });
  } else if (!isValidAmount(data.amount)) {
    errors.push({ field: 'amount', message: 'Amount must be a positive number greater than 0.' });
  }

  // Category validation
  if (!data.category) {
    errors.push({ field: 'category', message: 'Transaction category is required.' });
  } else if (!ALL_CATEGORIES.includes(data.category)) {
    errors.push({ field: 'category', message: `Invalid category: "${data.category}".` });
  } else if (data.type && !isValidCategoryForType(data.type, data.category)) {
    errors.push({
      field: 'category',
      message: `Category "${data.category}" is not valid for type "${data.type}".`,
    });
  }

  // Date validation (optional, defaults to now)
  if (data.date !== undefined && data.date !== null && data.date !== '') {
    if (!isValidDate(data.date)) {
      errors.push({ field: 'date', message: 'Please provide a valid transaction date.' });
    }
  }

  // Description validation (optional)
  if (data.description && typeof data.description === 'string' && data.description.length > 200) {
    errors.push({ field: 'description', message: 'Description cannot exceed 200 characters.' });
  }

  // Payment method validation (optional)
  if (data.paymentMethod && !PAYMENT_METHODS.includes(data.paymentMethod)) {
    errors.push({ field: 'paymentMethod', message: `Invalid payment method: "${data.paymentMethod}".` });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validates request payload for updating an existing transaction.
 *
 * @param {Object} data
 * @returns {{ isValid: boolean, errors: Array<{ field: string, message: string }> }}
 */
export const validateUpdateTransaction = (data = {}) => {
  const errors = [];

  if (Object.keys(data).length === 0) {
    errors.push({ field: 'body', message: 'Update payload cannot be empty.' });
    return { isValid: false, errors };
  }

  // If type provided
  if (data.type !== undefined) {
    if (![TRANSACTION_TYPES.INCOME, TRANSACTION_TYPES.EXPENSE].includes(data.type)) {
      errors.push({ field: 'type', message: 'Transaction type must be either income or expense.' });
    }
  }

  // If amount provided
  if (data.amount !== undefined) {
    if (!isValidAmount(data.amount)) {
      errors.push({ field: 'amount', message: 'Amount must be a positive number greater than 0.' });
    }
  }

  // If category provided
  if (data.category !== undefined) {
    if (!ALL_CATEGORIES.includes(data.category)) {
      errors.push({ field: 'category', message: `Invalid category: "${data.category}".` });
    } else if (data.type && !isValidCategoryForType(data.type, data.category)) {
      errors.push({
        field: 'category',
        message: `Category "${data.category}" is not valid for type "${data.type}".`,
      });
    }
  }

  // If date provided
  if (data.date !== undefined) {
    if (!isValidDate(data.date)) {
      errors.push({ field: 'date', message: 'Please provide a valid transaction date.' });
    }
  }

  // If description provided
  if (data.description !== undefined && typeof data.description === 'string' && data.description.length > 200) {
    errors.push({ field: 'description', message: 'Description cannot exceed 200 characters.' });
  }

  // If paymentMethod provided
  if (data.paymentMethod !== undefined && !PAYMENT_METHODS.includes(data.paymentMethod)) {
    errors.push({ field: 'paymentMethod', message: `Invalid payment method: "${data.paymentMethod}".` });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
