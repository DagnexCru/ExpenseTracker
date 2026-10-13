import { describe, it } from 'node:test';
import assert from 'node:assert';
import { isValidCategoryForType } from '../../../src/utils/category.util.js';

describe('Unit Category: Shopping', () => {
  it('should accept Shopping for expense type and reject for income', () => {
    assert.strictEqual(isValidCategoryForType('expense', 'Shopping'), true);
    assert.strictEqual(isValidCategoryForType('income', 'Shopping'), false);
  });
});
