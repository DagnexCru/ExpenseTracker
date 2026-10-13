import { describe, it } from 'node:test';
import assert from 'node:assert';
import { roundMonetaryAmount } from '../../../src/utils/amount.util.js';

describe('Monetary Precision Case 4', () => {
  it('should eliminate IEEE 754 precision drift', () => {
    const net = roundMonetaryAmount(1235 - 456.97999999999996);
    assert.strictEqual(typeof net, 'number');
    assert.strictEqual(net, Math.round((1235 - 456.97999999999996) * 100) / 100);
  });
});
