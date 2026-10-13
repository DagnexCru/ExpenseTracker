import { describe, it } from 'node:test';
import assert from 'node:assert';
import { isValidAmount, normalizeAmount } from '../../../src/utils/amount.util.js';

describe('Unit Amount: amount_null_rejected', () => {
  it('should validate null value rejection', () => {
    assert.strictEqual(isValidAmount(null), false);
  });
});
