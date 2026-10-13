import { describe, it } from 'node:test';
import assert from 'node:assert';
import { isValidAmount, normalizeAmount } from '../../../src/utils/amount.util.js';

describe('Unit Amount: amount_nan_rejected', () => {
  it('should validate NaN string rejection', () => {
    assert.strictEqual(isValidAmount("not_a_number"), false);
  });
});
