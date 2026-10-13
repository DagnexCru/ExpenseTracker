import { describe, it } from 'node:test';
import assert from 'node:assert';
import { CURRENCIES, getCurrencySymbol } from '../constants/currencies.js';

describe('Client: Currency List Structure', () => {
  it('should include ETB with Birr flag and symbol', () => {
    const etb = CURRENCIES.find(c => c.code === 'ETB');
    assert.ok(etb);
    assert.strictEqual(etb.symbol, 'Br');
    assert.strictEqual(getCurrencySymbol('ETB'), 'Br');
  });
});
