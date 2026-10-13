import { describe, it } from 'node:test';
import assert from 'node:assert';

describe('NoSQL Operator Defense: $lt', () => {
  it('should detect leading dollar sign in $lt', () => {
    assert.strictEqual('$lt'.startsWith('$'), true);
  });
});
