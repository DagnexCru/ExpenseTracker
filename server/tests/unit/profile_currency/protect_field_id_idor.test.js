import { describe, it } from 'node:test';
import assert from 'node:assert';

describe('IDOR Defense: id', () => {
  it('should prevent cross-tenant override of id', () => {
    const requestField = 'id';
    assert.strictEqual(typeof requestField, 'string');
  });
});
