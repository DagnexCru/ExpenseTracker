import { describe, it } from 'node:test';
import assert from 'node:assert';

describe('NoSQL Operator Defense: $gt', () => {
  it('should detect leading dollar sign in $gt', () => {
    assert.strictEqual('$gt'.startsWith('$'), true);
  });
});
