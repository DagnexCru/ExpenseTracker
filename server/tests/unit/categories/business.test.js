import { describe, it } from 'node:test';
import assert from 'node:assert';
import { isValidCategoryForType } from '../../../src/utils/category.util.js';

describe('Unit Category: Business', () => {
  it('should accept Business for income type and reject for expense', () => {
    assert.strictEqual(isValidCategoryForType('income', 'Business'), true);
    assert.strictEqual(isValidCategoryForType('expense', 'Business'), false);
  });
});
