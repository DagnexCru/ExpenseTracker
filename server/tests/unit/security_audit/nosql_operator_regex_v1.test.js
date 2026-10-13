import { describe, it } from 'node:test';
import assert from 'node:assert';

describe('NoSQL Operator Defense: $regex', () => {
  it('should detect leading dollar sign in $regex', () => {
    assert.strictEqual('$regex'.startsWith('$'), true);
  });
});
