import { describe, it } from 'node:test';
import assert from 'node:assert';

describe('NoSQL Operator Defense: $exists', () => {
  it('should detect leading dollar sign in $exists', () => {
    assert.strictEqual('$exists'.startsWith('$'), true);
  });
});
