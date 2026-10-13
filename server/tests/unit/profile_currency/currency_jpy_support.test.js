import { describe, it } from 'node:test';
import assert from 'node:assert';
import { isSupportedCurrency } from '../../../src/constants/currencies.js';

describe('Currency Support: JPY', () => {
  it('should recognize JPY as valid ISO currency', () => {
    assert.strictEqual(isSupportedCurrency('JPY'), true);
    assert.strictEqual(isSupportedCurrency('jpy'), true);
  });
});
