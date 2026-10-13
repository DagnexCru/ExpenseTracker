import { describe, it } from 'node:test';
import assert from 'node:assert';
import { isValidCategoryForType } from '../../../src/utils/category.util.js';

describe('Unit Category: Food & Dining', () => {
  it('should accept Food & Dining for expense type and reject for income', () => {
    assert.strictEqual(isValidCategoryForType('expense', 'Food & Dining'), true);
    assert.strictEqual(isValidCategoryForType('income', 'Food & Dining'), false);
  });
});
