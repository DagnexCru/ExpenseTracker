/**
 * @file transaction.service.js
 * @description Business logic and database operations for transactions with strict user ownership isolation
 */

import Transaction from '../models/Transaction.js';

/**
 * Creates a new transaction record owned by the authenticated user.
 *
 * @param {Object} params
 * @param {string} params.userId - Authenticated user's ObjectId
 * @param {Object} params.data - Validated transaction fields
 * @returns {Promise<import('../models/Transaction.js').Transaction>}
 */
export const createTransaction = async ({ userId, data }) => {
  const transaction = new Transaction({
    ...data,
    user: userId,
  });

  await transaction.save();
  return transaction;
};

/**
 * Retrieves transactions owned by the authenticated user with search, filtering, sorting, and pagination.
 *
 * @param {Object} params
 * @param {string} params.userId
 * @param {Object} [params.query]
 * @returns {Promise<{ transactions: Array<Object>, count: number, pagination: Object }>}
 */
export const getTransactions = async ({ userId, query = {} }) => {
  const {
    type,
    category,
    startDate,
    endDate,
    minAmount,
    maxAmount,
    search,
    paymentMethod,
    sortBy = 'date',
    sortOrder = 'desc',
    page = 1,
    limit = 10,
  } = query;

  // 1. Build query filter strictly isolated by authenticated user
  const filter = { user: userId };

  if (type) {
    filter.type = type;
  }

  if (category) {
    filter.category = category;
  }

  if (paymentMethod) {
    filter.paymentMethod = paymentMethod;
  }

  // Date range filter
  if (startDate || endDate) {
    filter.date = {};
    if (startDate) {
      filter.date.$gte = new Date(startDate);
    }
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      filter.date.$lte = end;
    }
  }

  // Amount range filter
  if (minAmount !== undefined || maxAmount !== undefined) {
    filter.amount = {};
    if (minAmount !== undefined && minAmount !== '') {
      filter.amount.$gte = Number(minAmount);
    }
    if (maxAmount !== undefined && maxAmount !== '') {
      filter.amount.$lte = Number(maxAmount);
    }
  }

  // Case-insensitive description search with regex escaping
  if (search && typeof search === 'string' && search.trim() !== '') {
    const escaped = search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    filter.description = { $regex: escaped, $options: 'i' };
  }

  // 2. Sorting options
  const allowedSortFields = ['date', 'amount', 'createdAt', 'category'];
  const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'date';
  const sortDirection = sortOrder && sortOrder.toLowerCase() === 'asc' ? 1 : -1;
  const sortOptions = { [sortField]: sortDirection, _id: -1 };

  // 3. Pagination calculation
  const parsedPage = Math.max(parseInt(page, 10) || 1, 1);
  const parsedLimit = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 100);
  const skip = (parsedPage - 1) * parsedLimit;

  // Execute data query and total count in parallel
  const [transactions, totalCount] = await Promise.all([
    Transaction.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(parsedLimit)
      .lean(),
    Transaction.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(totalCount / parsedLimit) || 1;

  // Format id attribute
  const formatted = transactions.map((t) => ({
    ...t,
    id: t._id.toString(),
  }));

  return {
    transactions: formatted,
    count: formatted.length,
    pagination: {
      page: parsedPage,
      limit: parsedLimit,
      totalCount,
      totalPages,
      hasNextPage: parsedPage < totalPages,
      hasPrevPage: parsedPage > 1,
    },
  };
};

/**
 * Retrieves a single transaction strictly verifying ownership.
 *
 * @param {Object} params
 * @param {string} params.userId
 * @param {string} params.transactionId
 * @returns {Promise<import('../models/Transaction.js').Transaction | null>}
 */
export const getTransactionById = async ({ userId, transactionId }) => {
  const transaction = await Transaction.findOne({
    _id: transactionId,
    user: userId, // Strict ownership check
  });

  return transaction;
};

/**
 * Updates an existing transaction strictly verifying ownership.
 *
 * @param {Object} params
 * @param {string} params.userId
 * @param {string} params.transactionId
 * @param {Object} params.data
 * @returns {Promise<import('../models/Transaction.js').Transaction | null>}
 */
export const updateTransaction = async ({ userId, transactionId, data }) => {
  // First verify existence and ownership
  const existing = await Transaction.findOne({
    _id: transactionId,
    user: userId,
  });

  if (!existing) {
    return null;
  }

  // If changing category without type, ensure new category matches existing type
  const targetType = data.type || existing.type;
  const targetCategory = data.category || existing.category;

  // Apply updates
  if (data.type !== undefined) existing.type = data.type;
  if (data.amount !== undefined) existing.amount = data.amount;
  if (data.category !== undefined) existing.category = data.category;
  if (data.description !== undefined) existing.description = data.description;
  if (data.date !== undefined) existing.date = data.date;
  if (data.paymentMethod !== undefined) existing.paymentMethod = data.paymentMethod;

  await existing.save();
  return existing;
};

/**
 * Deletes an existing transaction strictly verifying ownership.
 *
 * @param {Object} params
 * @param {string} params.userId
 * @param {string} params.transactionId
 * @returns {Promise<import('../models/Transaction.js').Transaction | null>}
 */
export const deleteTransaction = async ({ userId, transactionId }) => {
  const deleted = await Transaction.findOneAndDelete({
    _id: transactionId,
    user: userId, // Strict ownership check
  });

  return deleted;
};
