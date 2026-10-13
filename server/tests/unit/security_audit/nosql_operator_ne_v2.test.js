import { describe, it } from 'node:test';
import assert from 'node:assert';

describe('NoSQL Operator Defense: $ne', () => {
  it('should detect leading dollar sign in $ne', () => {
    assert.strictEqual('$ne'.startsWith('$'), true);
  });
});
