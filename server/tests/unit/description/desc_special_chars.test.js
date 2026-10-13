import { describe, it } from 'node:test';
import assert from 'node:assert';
import { validateCreateTransaction } from '../../../src/validators/transaction.validator.js';

describe('Unit Description: desc_special_chars', () => {
  it('should validate special characters', () => {
    assert.strictEqual(validateCreateTransaction({ type: "income", amount: 100, category: "Salary", description: "Bonus (Q3 2026) - 15%" }).isValid, true);
  });
});
