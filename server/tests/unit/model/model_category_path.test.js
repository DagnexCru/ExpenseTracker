import { describe, it } from 'node:test';
import assert from 'node:assert';
import Transaction from '../../../src/models/Transaction.js';

describe('Unit Model: model_category_path', () => {
  it('should verify schema path category', () => {
    assert.strictEqual(Boolean(Transaction.schema.paths.category), true);
  });
});
