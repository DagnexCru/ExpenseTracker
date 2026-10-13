import { describe, it } from 'node:test';
import assert from 'node:assert';
import { isValidCategoryForType } from '../../../src/utils/category.util.js';

describe('Unit Category: Freelance & Consulting', () => {
  it('should accept Freelance & Consulting for income type and reject for expense', () => {
    assert.strictEqual(isValidCategoryForType('income', 'Freelance & Consulting'), true);
    assert.strictEqual(isValidCategoryForType('expense', 'Freelance & Consulting'), false);
  });
});
