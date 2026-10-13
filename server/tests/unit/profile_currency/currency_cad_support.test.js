import { describe, it } from 'node:test';
import assert from 'node:assert';
import { isSupportedCurrency } from '../../../src/constants/currencies.js';

describe('Currency Support: CAD', () => {
  it('should recognize CAD as valid ISO currency', () => {
    assert.strictEqual(isSupportedCurrency('CAD'), true);
    assert.strictEqual(isSupportedCurrency('cad'), true);
  });
});
