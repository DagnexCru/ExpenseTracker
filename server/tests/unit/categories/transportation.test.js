import { describe, it } from 'node:test';
import assert from 'node:assert';
import { isValidCategoryForType } from '../../../src/utils/category.util.js';

describe('Unit Category: Transportation', () => {
  it('should accept Transportation for expense type and reject for income', () => {
    assert.strictEqual(isValidCategoryForType('expense', 'Transportation'), true);
    assert.strictEqual(isValidCategoryForType('income', 'Transportation'), false);
  });
});
