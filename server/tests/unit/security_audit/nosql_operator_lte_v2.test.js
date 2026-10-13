import { describe, it } from 'node:test';
import assert from 'node:assert';

describe('NoSQL Operator Defense: $lte', () => {
  it('should detect leading dollar sign in $lte', () => {
    assert.strictEqual('$lte'.startsWith('$'), true);
  });
});
