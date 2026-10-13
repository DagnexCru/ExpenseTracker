import { describe, it } from 'node:test';
import assert from 'node:assert';
import { PAYMENT_METHODS } from '../../../src/constants/transaction.constants.js';

describe('Unit Payment: cash', () => {
  it('should include cash in approved payment methods enum', () => {
    assert.ok(PAYMENT_METHODS.includes('cash'));
  });
});
