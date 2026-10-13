import { describe, it } from 'node:test';
import assert from 'node:assert';

describe('NoSQL Operator Defense: $gte', () => {
  it('should detect leading dollar sign in $gte', () => {
    assert.strictEqual('$gte'.startsWith('$'), true);
  });
});
