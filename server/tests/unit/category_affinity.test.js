import { describe, it } from 'node:test';
import assert from 'node:assert';
import { isValidCategoryForType, getCategoriesForType } from '../../src/utils/category.util.js';

describe('Unit: Category Affinity Validation', () => {
  it('should accept valid category for income', () => {
    assert.strictEqual(isValidCategoryForType('income', 'Salary'), true);
    assert.strictEqual(isValidCategoryForType('income', 'Food & Dining'), false);
  });

  it('should accept valid category for expense', () => {
    assert.strictEqual(isValidCategoryForType('expense', 'Food & Dining'), true);
    assert.strictEqual(isValidCategoryForType('expense', 'Salary'), false);
  });

  it('should reject invalid or missing inputs', () => {
    assert.strictEqual(isValidCategoryForType('unknown', 'Salary'), false);
    assert.strictEqual(isValidCategoryForType(null, 'Salary'), false);
    assert.strictEqual(isValidCategoryForType('expense', ''), false);
  });

  it('should return list of categories matching transaction type', () => {
    const incomeCats = getCategoriesForType('income');
    assert.ok(incomeCats.includes('Salary'));
    assert.strictEqual(incomeCats.includes('Food & Dining'), false);
  });
});
