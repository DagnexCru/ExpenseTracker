import { describe, it } from 'node:test';
import assert from 'node:assert';
import { isSupportedCurrency } from '../../../src/constants/currencies.js';

describe('Currency Support: ETB', () => {
  it('should recognize ETB as valid ISO currency', () => {
    assert.strictEqual(isSupportedCurrency('ETB'), true);
    assert.strictEqual(isSupportedCurrency('etb'), true);
  });
});
