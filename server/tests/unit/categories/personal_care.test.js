import { describe, it } from 'node:test';
import assert from 'node:assert';
import { isValidCategoryForType } from '../../../src/utils/category.util.js';

describe('Unit Category: Personal Care', () => {
  it('should accept Personal Care for expense type and reject for income', () => {
    assert.strictEqual(isValidCategoryForType('expense', 'Personal Care'), true);
    assert.strictEqual(isValidCategoryForType('income', 'Personal Care'), false);
  });
});
