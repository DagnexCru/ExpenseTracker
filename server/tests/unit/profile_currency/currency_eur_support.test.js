import { describe, it } from 'node:test';
import assert from 'node:assert';
import { isSupportedCurrency } from '../../../src/constants/currencies.js';

describe('Currency Support: EUR', () => {
  it('should recognize EUR as valid ISO currency', () => {
    assert.strictEqual(isSupportedCurrency('EUR'), true);
    assert.strictEqual(isSupportedCurrency('eur'), true);
  });
});
