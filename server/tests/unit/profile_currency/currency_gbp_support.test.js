import { describe, it } from 'node:test';
import assert from 'node:assert';
import { isSupportedCurrency } from '../../../src/constants/currencies.js';

describe('Currency Support: GBP', () => {
  it('should recognize GBP as valid ISO currency', () => {
    assert.strictEqual(isSupportedCurrency('GBP'), true);
    assert.strictEqual(isSupportedCurrency('gbp'), true);
  });
});
