import { describe, it } from 'node:test';
import assert from 'node:assert';
import Transaction from '../../../src/models/Transaction.js';

describe('Unit Model: model_type_path', () => {
  it('should verify schema path type', () => {
    assert.strictEqual(Boolean(Transaction.schema.paths.type), true);
  });
});
