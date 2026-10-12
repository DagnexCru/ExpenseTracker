import { describe, it } from 'node:test';
import assert from 'node:assert';
import { SUPPORTED_CURRENCIES, DEFAULT_CURRENCY, CURRENCY_SYMBOLS } from '../../src/constants/currency.constants.js';

describe('Currency Constants Tests', () => {
  it('should default to ETB', () => {
    assert.strictEqual(DEFAULT_CURRENCY, 'ETB');
    assert.ok(SUPPORTED_CURRENCIES.includes('ETB'));
  });

  it('should map symbols correctly', () => {
    assert.strictEqual(CURRENCY_SYMBOLS.ETB, 'Br');
    assert.strictEqual(CURRENCY_SYMBOLS.USD, '$');
  });
});
