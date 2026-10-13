import { describe, it } from 'node:test';
import assert from 'node:assert';
import { isValidAmount, normalizeAmount } from '../../../src/utils/amount.util.js';

describe('Unit Amount: amount_integer', () => {
  it('should validate integer numbers', () => {
    assert.strictEqual(isValidAmount(100), true);
  });
});
