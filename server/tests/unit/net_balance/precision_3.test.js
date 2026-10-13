import { describe, it } from 'node:test';
import assert from 'node:assert';
import { roundMonetaryAmount } from '../../../src/utils/amount.util.js';

describe('Monetary Precision Case 3', () => {
  it('should eliminate IEEE 754 precision drift', () => {
    const net = roundMonetaryAmount(1234.8899999999999 - 456.92999999999995);
    assert.strictEqual(typeof net, 'number');
    assert.strictEqual(net, Math.round((1234.8899999999999 - 456.92999999999995) * 100) / 100);
  });
});
