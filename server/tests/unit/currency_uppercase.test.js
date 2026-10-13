import { describe, it } from 'node:test';
import assert from 'node:assert';
import { SUPPORTED_CURRENCIES } from '../../src/constants/currency.constants.js';

describe('Unit: Currency Uppercase Standard', () => {
  it('should ensure all supported currency codes are uppercase 3-letter ISO codes', () => {
    SUPPORTED_CURRENCIES.forEach(curr => {
      assert.strictEqual(curr, curr.toUpperCase());
      assert.strictEqual(curr.length, 3);
    });
  });
});
