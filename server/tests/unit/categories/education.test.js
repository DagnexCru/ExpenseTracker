import { describe, it } from 'node:test';
import assert from 'node:assert';
import { isValidCategoryForType } from '../../../src/utils/category.util.js';

describe('Unit Category: Education', () => {
  it('should accept Education for expense type and reject for income', () => {
    assert.strictEqual(isValidCategoryForType('expense', 'Education'), true);
    assert.strictEqual(isValidCategoryForType('income', 'Education'), false);
  });
});
