import { describe, it } from 'node:test';
import assert from 'node:assert';
import { normalizeAmount, isValidAmount } from '../../src/utils/amount.util.js';

describe('Unit: Monetary Amount Precision and Validation', () => {
  it('should round amounts to two decimal places accurately', () => {
    assert.strictEqual(normalizeAmount(10.555), 10.56);
    assert.strictEqual(normalizeAmount(10.554), 10.55);
    assert.strictEqual(normalizeAmount('125.5'), 125.5);
  });

  it('should accept valid positive numbers', () => {
    assert.strictEqual(isValidAmount(100), true);
    assert.strictEqual(isValidAmount('50.25'), true);
    assert.strictEqual(isValidAmount(0.01), true);
  });

  it('should reject zero, negative numbers, NaN, and non-numeric values', () => {
    assert.strictEqual(isValidAmount(0), false);
    assert.strictEqual(isValidAmount(-25), false);
    assert.strictEqual(isValidAmount('abc'), false);
    assert.strictEqual(isValidAmount(null), false);
    assert.strictEqual(isValidAmount(undefined), false);
  });
});
