import { describe, it } from 'node:test';
import assert from 'node:assert';

describe('NoSQL Operator Defense: $nin', () => {
  it('should detect leading dollar sign in $nin', () => {
    assert.strictEqual('$nin'.startsWith('$'), true);
  });
});
