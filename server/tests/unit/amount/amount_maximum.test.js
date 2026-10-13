import { describe, it } from 'node:test';
import assert from 'node:assert';
import { isValidAmount, normalizeAmount } from '../../../src/utils/amount.util.js';

describe('Unit Amount: amount_maximum', () => {
  it('should validate maximum valid amount 1 billion', () => {
    assert.strictEqual(isValidAmount(1000000000), true);
  });
});
