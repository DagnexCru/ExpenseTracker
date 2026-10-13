import { describe, it } from 'node:test';
import assert from 'node:assert';
import { isValidCategoryForType } from '../../../src/utils/category.util.js';

describe('Unit Category: Housing & Rent', () => {
  it('should accept Housing & Rent for expense type and reject for income', () => {
    assert.strictEqual(isValidCategoryForType('expense', 'Housing & Rent'), true);
    assert.strictEqual(isValidCategoryForType('income', 'Housing & Rent'), false);
  });
});
