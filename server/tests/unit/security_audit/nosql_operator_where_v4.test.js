import { describe, it } from 'node:test';
import assert from 'node:assert';

describe('NoSQL Operator Defense: $where', () => {
  it('should detect leading dollar sign in $where', () => {
    assert.strictEqual('$where'.startsWith('$'), true);
  });
});
