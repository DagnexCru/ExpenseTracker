import { describe, it } from 'node:test';
import assert from 'node:assert';
import { validateCreateTransaction } from '../../../src/validators/transaction.validator.js';

describe('Unit Description: desc_empty_allowed', () => {
  it('should validate empty description allowed', () => {
    assert.strictEqual(validateCreateTransaction({ type: "income", amount: 100, category: "Salary", description: "" }).isValid, true);
  });
});
