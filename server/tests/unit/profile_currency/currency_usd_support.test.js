import { describe, it } from 'node:test';
import assert from 'node:assert';
import { isSupportedCurrency } from '../../../src/constants/currencies.js';

describe('Currency Support: USD', () => {
  it('should recognize USD as valid ISO currency', () => {
    assert.strictEqual(isSupportedCurrency('USD'), true);
    assert.strictEqual(isSupportedCurrency('usd'), true);
  });
});
