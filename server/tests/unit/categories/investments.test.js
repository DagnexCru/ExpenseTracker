import { describe, it } from 'node:test';
import assert from 'node:assert';
import { isValidCategoryForType } from '../../../src/utils/category.util.js';

describe('Unit Category: Investments', () => {
  it('should accept Investments for income type and reject for expense', () => {
    assert.strictEqual(isValidCategoryForType('income', 'Investments'), true);
    assert.strictEqual(isValidCategoryForType('expense', 'Investments'), false);
  });
});
