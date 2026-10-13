import { describe, it } from 'node:test';
import assert from 'node:assert';
import { isValidAmount, normalizeAmount } from '../../../src/utils/amount.util.js';

describe('Unit Amount: amount_zero_rejected', () => {
  it('should validate zero amount rejected', () => {
    assert.strictEqual(isValidAmount(0), false);
  });
});
