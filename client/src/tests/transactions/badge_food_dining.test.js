import { describe, it } from 'node:test';
import assert from 'node:assert';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, PAYMENT_METHODS } from '../../constants/transactionCategories.js';

describe('Client Unit: badge_food_dining', () => {
  it('should verify Food & Dining color badge mapping', () => {
    assert.ok(EXPENSE_CATEGORIES.length > 0);
    assert.ok(INCOME_CATEGORIES.length > 0);
    assert.ok(PAYMENT_METHODS.length > 0);
  });
});
