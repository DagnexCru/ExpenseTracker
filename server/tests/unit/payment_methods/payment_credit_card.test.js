import { describe, it } from 'node:test';
import assert from 'node:assert';
import { PAYMENT_METHODS } from '../../../src/constants/transaction.constants.js';

describe('Unit Payment: credit_card', () => {
  it('should include credit_card in approved payment methods enum', () => {
    assert.ok(PAYMENT_METHODS.includes('credit_card'));
  });
});
