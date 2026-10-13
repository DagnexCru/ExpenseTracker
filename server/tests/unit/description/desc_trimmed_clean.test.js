import { describe, it } from 'node:test';
import assert from 'node:assert';
import { validateCreateTransaction } from '../../../src/validators/transaction.validator.js';

describe('Unit Description: desc_trimmed_clean', () => {
  it('should validate whitespace handling', () => {
    assert.strictEqual(validateCreateTransaction({ type: "income", amount: 100, category: "Salary", description: "   clean   " }).isValid, true);
  });
});
