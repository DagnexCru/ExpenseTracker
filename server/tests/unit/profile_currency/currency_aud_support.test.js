import { describe, it } from 'node:test';
import assert from 'node:assert';
import { isSupportedCurrency } from '../../../src/constants/currencies.js';

describe('Currency Support: AUD', () => {
  it('should recognize AUD as valid ISO currency', () => {
    assert.strictEqual(isSupportedCurrency('AUD'), true);
    assert.strictEqual(isSupportedCurrency('aud'), true);
  });
});
