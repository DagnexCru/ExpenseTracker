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

/**
 * Middleware validating query parameters for GET /api/transactions
 */
export const validateTransactionListQuery = (req, res, next) => {
  const {
    type,
    category,
    startDate,
    endDate,
    minAmount,
    maxAmount,
    sortBy,
    sortOrder,
    page,
    limit,
  } = req.query;

  // Type validation
  if (type && ![TRANSACTION_TYPES.INCOME, TRANSACTION_TYPES.EXPENSE].includes(type)) {
    return res.status(400).json({
      success: false,
      statusCode: 400,
      message: "Filter 'type' must be either 'income' or 'expense'.",
      error: { code: 'INVALID_TRANSACTION_TYPE' },
    });
  }

  // Category validation
  if (category && !ALL_CATEGORIES.includes(category)) {
    return res.status(400).json({
      success: false,
      statusCode: 400,
      message: `Invalid category filter: "${category}".`,
      error: { code: 'INVALID_CATEGORY' },
    });
  }

  // Date range validation
  if (startDate) {
    const start = new Date(startDate);
    if (isNaN(start.getTime())) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: 'Invalid startDate format. Please provide a valid ISO date (YYYY-MM-DD).',
        error: { code: 'INVALID_START_DATE' },
      });
    }
  }

  if (endDate) {
    const end = new Date(endDate);
    if (isNaN(end.getTime())) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: 'Invalid endDate format. Please provide a valid ISO date (YYYY-MM-DD).',
        error: { code: 'INVALID_END_DATE' },
      });
    }
  }

  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (start > end) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: 'startDate cannot be after endDate.',
        error: { code: 'INVALID_DATE_RANGE' },
      });
    }
  }

  // Amount range validation
  if (minAmount !== undefined) {
    const min = Number(minAmount);
    if (isNaN(min) || min < 0) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: 'minAmount must be a non-negative number.',
        error: { code: 'INVALID_MIN_AMOUNT' },
      });
    }
  }

  if (maxAmount !== undefined) {
    const max = Number(maxAmount);
    if (isNaN(max) || max < 0) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: 'maxAmount must be a non-negative number.',
        error: { code: 'INVALID_MAX_AMOUNT' },
      });
    }
  }

  if (minAmount !== undefined && maxAmount !== undefined) {
    if (Number(minAmount) > Number(maxAmount)) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: 'minAmount cannot be greater than maxAmount.',
        error: { code: 'INVALID_AMOUNT_RANGE' },
      });
    }
  }

  // Sorting validation
  const allowedSortFields = ['date', 'amount', 'createdAt', 'category'];
  if (sortBy && !allowedSortFields.includes(sortBy)) {
    return res.status(400).json({
      success: false,
      statusCode: 400,
      message: `Invalid sortBy field. Allowed fields: ${allowedSortFields.join(', ')}.`,
      error: { code: 'INVALID_SORT_FIELD' },
    });
  }

  if (sortOrder && !['asc', 'desc'].includes(sortOrder.toLowerCase())) {
    return res.status(400).json({
      success: false,
      statusCode: 400,
      message: "sortOrder must be either 'asc' or 'desc'.",
      error: { code: 'INVALID_SORT_ORDER' },
    });
  }

  // Pagination validation
  if (page !== undefined) {
    const parsedPage = parseInt(page, 10);
    if (isNaN(parsedPage) || parsedPage < 1) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: 'page must be a positive integer greater than or equal to 1.',
        error: { code: 'INVALID_PAGE_NUMBER' },
      });
    }
  }

  if (limit !== undefined) {
    const parsedLimit = parseInt(limit, 10);
    if (isNaN(parsedLimit) || parsedLimit < 1 || parsedLimit > 100) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: 'limit must be an integer between 1 and 100.',
        error: { code: 'INVALID_PAGE_LIMIT' },
      });
    }
  }

  next();
};
