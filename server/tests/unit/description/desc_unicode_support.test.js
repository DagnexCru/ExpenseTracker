import { describe, it } from 'node:test';
import assert from 'node:assert';
import { validateCreateTransaction } from '../../../src/validators/transaction.validator.js';

describe('Unit Description: desc_unicode_support', () => {
  it('should validate unicode support', () => {
    assert.strictEqual(validateCreateTransaction({ type: "income", amount: 100, category: "Salary", description: "የወር ደመወዝ" }).isValid, true);
  });
});
