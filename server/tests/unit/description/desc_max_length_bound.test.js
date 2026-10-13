import { describe, it } from 'node:test';
import assert from 'node:assert';
import { validateCreateTransaction } from '../../../src/validators/transaction.validator.js';

describe('Unit Description: desc_max_length_bound', () => {
  it('should validate 200 char boundary', () => {
    assert.strictEqual(validateCreateTransaction({ type: "income", amount: 100, category: "Salary", description: "A".repeat(200) }).isValid, true);
  });
});
