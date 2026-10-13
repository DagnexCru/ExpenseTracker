import { describe, it } from 'node:test';
import assert from 'node:assert';
import { isValidCategoryForType } from '../../../src/utils/category.util.js';

describe('Unit Category: Utilities', () => {
  it('should accept Utilities for expense type and reject for income', () => {
    assert.strictEqual(isValidCategoryForType('expense', 'Utilities'), true);
    assert.strictEqual(isValidCategoryForType('income', 'Utilities'), false);
  });
});
