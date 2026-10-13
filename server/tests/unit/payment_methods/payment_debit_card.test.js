import { describe, it } from 'node:test';
import assert from 'node:assert';
import { PAYMENT_METHODS } from '../../../src/constants/transaction.constants.js';

describe('Unit Payment: debit_card', () => {
  it('should include debit_card in approved payment methods enum', () => {
    assert.ok(PAYMENT_METHODS.includes('debit_card'));
  });
});
