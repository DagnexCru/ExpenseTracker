import { describe, it } from 'node:test';
import assert from 'node:assert';
import { CURRENCIES, DEFAULT_CURRENCY_CODE, getCurrencySymbol } from '../constants/currencies.js';

describe('Client Currencies Constants Tests', () => {
  it('should have ETB as default currency', () => {
    assert.strictEqual(DEFAULT_CURRENCY_CODE, 'ETB');
  });

  it('should return correct symbols for currency codes', () => {
    assert.strictEqual(getCurrencySymbol('ETB'), 'Br');
    assert.strictEqual(getCurrencySymbol('USD'), '$');
    assert.strictEqual(getCurrencySymbol('UNKNOWN'), 'UNKNOWN');
  });
});
