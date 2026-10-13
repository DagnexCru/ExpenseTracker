import mongoose from 'mongoose';
import {
  TRANSACTION_TYPES,
  PAYMENT_METHODS,
  DEFAULT_PAYMENT_METHOD,
  ALL_CATEGORIES,
} from '../constants/transaction.constants.js';
import { isValidCategoryForType } from '../utils/category.util.js';

const transactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Transaction must belong to an authenticated user.'],
      index: true,
    },
    type: {
      type: String,
      required: [true, 'Transaction type is required.'],
      enum: {
        values: [TRANSACTION_TYPES.INCOME, TRANSACTION_TYPES.EXPENSE],
        message: 'Transaction type must be either income or expense.',
      },
    },
    amount: {
      type: Number,
      required: [true, 'Transaction amount is required.'],
      min: [0.01, 'Amount must be greater than zero.'],
      max: [1000000000, 'Amount cannot exceed 1 billion.'],
      set: (val) => Math.round(Number(val) * 100) / 100, // 2 decimal precision
    },
    category: {
      type: String,
      required: [true, 'Transaction category is required.'],
      enum: {
        values: ALL_CATEGORIES,
        message: 'Invalid transaction category specified.',
      },
      validate: {
        validator: function (val) {
          // Validate category affinity with current type
          return isValidCategoryForType(this.type, val);
        },
        message: function (props) {
          return `Category "${props.value}" is not valid for transaction type "${this.type}".`;
        },
      },
    },
    description: {
      type: String,
      trim: true,
      maxlength: [200, 'Description cannot exceed 200 characters.'],
      default: '',
    },
    date: {
      type: Date,
      required: [true, 'Transaction date is required.'],
      default: Date.now,
    },
    paymentMethod: {
      type: String,
      enum: {
        values: PAYMENT_METHODS,
        message: 'Invalid payment method specified.',
      },
      default: DEFAULT_PAYMENT_METHOD,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for optimal queries
transactionSchema.index({ user: 1, date: -1 });
transactionSchema.index({ user: 1, type: 1 });
transactionSchema.index({ user: 1, category: 1 });

// Clean serialization to JSON
transactionSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;
