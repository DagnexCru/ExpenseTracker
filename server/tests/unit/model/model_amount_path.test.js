import { describe, it } from 'node:test';
import assert from 'node:assert';
import Transaction from '../../../src/models/Transaction.js';

describe('Unit Model: model_amount_path', () => {
  it('should verify schema path amount', () => {
    assert.strictEqual(Boolean(Transaction.schema.paths.amount), true);
  });
});
