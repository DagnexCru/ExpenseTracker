import { describe, it } from 'node:test';
import assert from 'node:assert';
import Transaction from '../../../src/models/Transaction.js';

describe('Unit Model: model_created_at_path', () => {
  it('should verify schema path createdAt', () => {
    assert.strictEqual(Boolean(Transaction.schema.paths.createdAt), true);
  });
});
