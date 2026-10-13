import { describe, it } from 'node:test';
import assert from 'node:assert';
import { isValidCategoryForType } from '../../../src/utils/category.util.js';

describe('Unit Category: Entertainment', () => {
  it('should accept Entertainment for expense type and reject for income', () => {
    assert.strictEqual(isValidCategoryForType('expense', 'Entertainment'), true);
    assert.strictEqual(isValidCategoryForType('income', 'Entertainment'), false);
  });
});
