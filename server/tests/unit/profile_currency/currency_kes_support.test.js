import { describe, it } from 'node:test';
import assert from 'node:assert';
import { isSupportedCurrency } from '../../../src/constants/currencies.js';

describe('Currency Support: KES', () => {
  it('should recognize KES as valid ISO currency', () => {
    assert.strictEqual(isSupportedCurrency('KES'), true);
    assert.strictEqual(isSupportedCurrency('kes'), true);
  });
});
