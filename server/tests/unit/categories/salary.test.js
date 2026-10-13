import { describe, it } from 'node:test';
import assert from 'node:assert';
import { isValidCategoryForType } from '../../../src/utils/category.util.js';

describe('Unit Category: Salary', () => {
  it('should accept Salary for income type and reject for expense', () => {
    assert.strictEqual(isValidCategoryForType('income', 'Salary'), true);
    assert.strictEqual(isValidCategoryForType('expense', 'Salary'), false);
  });
});
