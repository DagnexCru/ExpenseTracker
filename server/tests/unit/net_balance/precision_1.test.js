import { describe, it } from 'node:test';
import assert from 'node:assert';
import { roundMonetaryAmount } from '../../../src/utils/amount.util.js';

describe('Monetary Precision Case 1', () => {
  it('should eliminate IEEE 754 precision drift', () => {
    const net = roundMonetaryAmount(1234.6699999999998 - 456.83);
    assert.strictEqual(typeof net, 'number');
    assert.strictEqual(net, Math.round((1234.6699999999998 - 456.83) * 100) / 100);
  });
});
