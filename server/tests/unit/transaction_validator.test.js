import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  validateCreateTransaction,
  validateUpdateTransaction,
} from '../../src/validators/transaction.validator.js';

describe('Unit: Transaction Validators', () => {
  it('should accept valid transaction payload', () => {
    const result = validateCreateTransaction({
      type: 'expense',
      amount: 150.5,
      category: 'Food & Dining',
      description: 'Lunch at traditional restaurant',
      paymentMethod: 'cash',
    });
    assert.strictEqual(result.isValid, true);
    assert.strictEqual(result.errors.length, 0);
  });

  it('should reject invalid amount <= 0', () => {
    const result = validateCreateTransaction({
      type: 'expense',
      amount: -10,
      category: 'Food & Dining',
    });
    assert.strictEqual(result.isValid, false);
    assert.ok(result.errors.some(e => e.field === 'amount'));
  });

  it('should reject category mismatch with transaction type', () => {
    const result = validateCreateTransaction({
      type: 'income',
      amount: 5000,
      category: 'Food & Dining', // Food is an expense category!
    });
    assert.strictEqual(result.isValid, false);
    assert.ok(result.errors.some(e => e.field === 'category'));
  });

  it('should reject empty body for update', () => {
    const result = validateUpdateTransaction({});
    assert.strictEqual(result.isValid, false);
  });
});
