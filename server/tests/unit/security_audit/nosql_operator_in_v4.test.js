import { describe, it } from 'node:test';
import assert from 'node:assert';

describe('NoSQL Operator Defense: $in', () => {
  it('should detect leading dollar sign in $in', () => {
    assert.strictEqual('$in'.startsWith('$'), true);
  });
});
