import { describe, it } from 'node:test';
import assert from 'node:assert';
import { isValidCategoryForType } from '../../../src/utils/category.util.js';

describe('Unit Category: Healthcare', () => {
  it('should accept Healthcare for expense type and reject for income', () => {
    assert.strictEqual(isValidCategoryForType('expense', 'Healthcare'), true);
    assert.strictEqual(isValidCategoryForType('income', 'Healthcare'), false);
  });
});
