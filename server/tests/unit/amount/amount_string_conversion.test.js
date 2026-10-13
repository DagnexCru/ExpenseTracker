import { describe, it } from 'node:test';
import assert from 'node:assert';
import { isValidAmount, normalizeAmount } from '../../../src/utils/amount.util.js';

describe('Unit Amount: amount_string_conversion', () => {
  it('should validate parsing string numbers', () => {
    assert.strictEqual(isValidAmount("45.50"), true);
  });
});
