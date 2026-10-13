import { describe, it } from 'node:test';
import assert from 'node:assert';
import { isValidAmount, normalizeAmount } from '../../../src/utils/amount.util.js';

describe('Unit Amount: amount_negative_rejected', () => {
  it('should validate negative amount rejected', () => {
    assert.strictEqual(isValidAmount(-10), false);
  });
});
