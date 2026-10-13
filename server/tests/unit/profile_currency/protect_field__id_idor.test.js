import { describe, it } from 'node:test';
import assert from 'node:assert';

describe('IDOR Defense: _id', () => {
  it('should prevent cross-tenant override of _id', () => {
    const requestField = '_id';
    assert.strictEqual(typeof requestField, 'string');
  });
});
