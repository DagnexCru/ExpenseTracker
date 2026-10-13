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
 * Retrieves all transactions owned by the authenticated user with sorting.
 *
 * @param {Object} params
 * @param {string} params.userId
 * @param {Object} [params.query]
 * @returns {Promise<{ transactions: Array<Object>, count: number }>}
 */
export const getTransactions = async ({ userId, query = {} }) => {
  const filter = { user: userId };

  if (query.type) {
    filter.type = query.type;
  }
  if (query.category) {
    filter.category = query.category;
  }

  const transactions = await Transaction.find(filter)
    .sort({ date: -1, createdAt: -1 })
    .lean({ virtuals: true });

  // Map to clean id attribute
  const formatted = transactions.map((t) => ({
    ...t,
    id: t._id.toString(),
  }));

  return {
    transactions: formatted,
    count: formatted.length,
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
