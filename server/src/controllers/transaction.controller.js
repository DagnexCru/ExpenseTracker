/**
 * @file transaction.controller.js
 * @description HTTP request handlers for Transaction endpoints
 */

import mongoose from 'mongoose';
import {
  createTransaction,
  getTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
} from '../services/transaction.service.js';
import {
  validateCreateTransaction,
  validateUpdateTransaction,
} from '../validators/transaction.validator.js';

/**
 * @desc    Create a new transaction
 * @route   POST /api/transactions
 * @access  Private
 */
export const create = async (req, res, next) => {
  try {
    const { isValid, errors } = validateCreateTransaction(req.body);
    if (!isValid) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid transaction data provided.',
          details: errors,
        },
      });
    }

    const transaction = await createTransaction({
      userId: req.user._id,
      data: req.body,
    });

    res.status(201).json({
      success: true,
      data: {
        transaction,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get all transactions for the authenticated user
 * @route   GET /api/transactions
 * @access  Private
 */
export const getAll = async (req, res, next) => {
  try {
    const { transactions, count, pagination } = await getTransactions({
      userId: req.user._id,
      query: req.query,
    });

    res.status(200).json({
      success: true,
      count,
      pagination,
      data: {
        transactions,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get a single transaction by ID
 * @route   GET /api/transactions/:id
 * @access  Private
 */
export const getById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_ID',
          message: 'Invalid transaction ID format.',
        },
      });
    }

    const transaction = await getTransactionById({
      userId: req.user._id,
      transactionId: id,
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'TRANSACTION_NOT_FOUND',
          message: 'Transaction not found.',
        },
      });
    }

    res.status(200).json({
      success: true,
      data: {
        transaction,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Update a transaction by ID
 * @route   PUT /api/transactions/:id
 * @access  Private
 */
export const update = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_ID',
          message: 'Invalid transaction ID format.',
        },
      });
    }

    const { isValid, errors } = validateUpdateTransaction(req.body);
    if (!isValid) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid transaction update data.',
          details: errors,
        },
      });
    }

    const updated = await updateTransaction({
      userId: req.user._id,
      transactionId: id,
      data: req.body,
    });

    if (!updated) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'TRANSACTION_NOT_FOUND',
          message: 'Transaction not found.',
        },
      });
    }

    res.status(200).json({
      success: true,
      data: {
        transaction: updated,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Delete a transaction by ID
 * @route   DELETE /api/transactions/:id
 * @access  Private
 */
export const remove = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_ID',
          message: 'Invalid transaction ID format.',
        },
      });
    }

    const deleted = await deleteTransaction({
      userId: req.user._id,
      transactionId: id,
    });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'TRANSACTION_NOT_FOUND',
          message: 'Transaction not found.',
        },
      });
    }

    res.status(200).json({
      success: true,
      data: {
        message: 'Transaction deleted successfully.',
      },
    });
  } catch (err) {
    next(err);
  }
};
