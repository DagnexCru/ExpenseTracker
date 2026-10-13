import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  TRANSACTION_TYPES,
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
  PAYMENT_METHODS,
  DEFAULT_PAYMENT_METHOD,
} from '../../src/constants/transaction.constants.js';

describe('Unit: Transaction Constants Verification', () => {
  it('should define income and expense types strictly', () => {
    assert.strictEqual(TRANSACTION_TYPES.INCOME, 'income');
    assert.strictEqual(TRANSACTION_TYPES.EXPENSE, 'expense');
  });

  it('should contain expected categories in income and expense lists', () => {
    assert.ok(EXPENSE_CATEGORIES.includes('Food & Dining'));
    assert.ok(INCOME_CATEGORIES.includes('Salary'));
  });

  it('should default payment method to cash', () => {
    assert.strictEqual(DEFAULT_PAYMENT_METHOD, 'cash');
    assert.ok(PAYMENT_METHODS.includes('cash'));
    assert.ok(PAYMENT_METHODS.includes('mobile_money'));
  });
});
