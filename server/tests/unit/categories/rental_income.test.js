import { describe, it } from 'node:test';
import assert from 'node:assert';
import { isValidCategoryForType } from '../../../src/utils/category.util.js';

describe('Unit Category: Rental Income', () => {
  it('should accept Rental Income for income type and reject for expense', () => {
    assert.strictEqual(isValidCategoryForType('income', 'Rental Income'), true);
    assert.strictEqual(isValidCategoryForType('expense', 'Rental Income'), false);
  });
});
