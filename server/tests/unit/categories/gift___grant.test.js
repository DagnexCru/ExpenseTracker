import { describe, it } from 'node:test';
import assert from 'node:assert';
import { isValidCategoryForType } from '../../../src/utils/category.util.js';

describe('Unit Category: Gift & Grant', () => {
  it('should accept Gift & Grant for income type and reject for expense', () => {
    assert.strictEqual(isValidCategoryForType('income', 'Gift & Grant'), true);
    assert.strictEqual(isValidCategoryForType('expense', 'Gift & Grant'), false);
  });
});
