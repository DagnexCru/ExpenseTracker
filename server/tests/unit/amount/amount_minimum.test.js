import { describe, it } from 'node:test';
import assert from 'node:assert';
import { isValidAmount, normalizeAmount } from '../../../src/utils/amount.util.js';

describe('Unit Amount: amount_minimum', () => {
  it('should validate minimum valid amount 0.01', () => {
    assert.strictEqual(isValidAmount(0.01), true);
  });
});
