import { describe, it } from 'node:test';
import assert from 'node:assert';
import Transaction from '../../../src/models/Transaction.js';

describe('Unit Model: model_payment_method_path', () => {
  it('should verify schema path paymentMethod', () => {
    assert.strictEqual(Boolean(Transaction.schema.paths.paymentMethod), true);
  });
});
