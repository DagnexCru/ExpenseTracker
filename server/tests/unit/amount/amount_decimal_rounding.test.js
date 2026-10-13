import { describe, it } from 'node:test';
import assert from 'node:assert';
import { isValidAmount, normalizeAmount } from '../../../src/utils/amount.util.js';

describe('Unit Amount: amount_decimal_rounding', () => {
  it('should validate rounding to 2 decimals', () => {
    assert.strictEqual(normalizeAmount(12.3456), 12.35);
  });
});
