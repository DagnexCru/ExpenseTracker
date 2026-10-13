import { describe, it } from 'node:test';
import assert from 'node:assert';
import Transaction from '../../../src/models/Transaction.js';

describe('Unit Model: model_user_path', () => {
  it('should verify schema path user', () => {
    assert.strictEqual(Boolean(Transaction.schema.paths.user), true);
  });
});
