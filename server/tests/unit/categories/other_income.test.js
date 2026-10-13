import { describe, it } from 'node:test';
import assert from 'node:assert';
import { isValidCategoryForType } from '../../../src/utils/category.util.js';

describe('Unit Category: Other Income', () => {
  it('should accept Other Income for income type and reject for expense', () => {
    assert.strictEqual(isValidCategoryForType('income', 'Other Income'), true);
    assert.strictEqual(isValidCategoryForType('expense', 'Other Income'), false);
  });
});
