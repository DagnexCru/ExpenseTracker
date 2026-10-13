import { describe, it } from 'node:test';
import assert from 'node:assert';
import { isValidAmount, normalizeAmount } from '../../../src/utils/amount.util.js';

describe('Unit Amount: amount_large_value', () => {
  it('should validate large value cap check', () => {
    assert.strictEqual(isValidAmount(2000000000), false);
  });
});
