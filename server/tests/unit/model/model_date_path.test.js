import { describe, it } from 'node:test';
import assert from 'node:assert';
import Transaction from '../../../src/models/Transaction.js';

describe('Unit Model: model_date_path', () => {
  it('should verify schema path date', () => {
    assert.strictEqual(Boolean(Transaction.schema.paths.date), true);
  });
});
