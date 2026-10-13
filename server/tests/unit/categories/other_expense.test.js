import { describe, it } from 'node:test';
import assert from 'node:assert';
import { isValidCategoryForType } from '../../../src/utils/category.util.js';

describe('Unit Category: Other Expense', () => {
  it('should accept Other Expense for expense type and reject for income', () => {
    assert.strictEqual(isValidCategoryForType('expense', 'Other Expense'), true);
    assert.strictEqual(isValidCategoryForType('income', 'Other Expense'), false);
  });
});
