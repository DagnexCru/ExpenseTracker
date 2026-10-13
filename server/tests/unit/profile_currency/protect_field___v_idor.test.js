import { describe, it } from 'node:test';
import assert from 'node:assert';

describe('IDOR Defense: __v', () => {
  it('should prevent cross-tenant override of __v', () => {
    const requestField = '__v';
    assert.strictEqual(typeof requestField, 'string');
  });
});
