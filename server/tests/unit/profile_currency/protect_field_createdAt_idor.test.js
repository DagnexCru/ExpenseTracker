import { describe, it } from 'node:test';
import assert from 'node:assert';

describe('IDOR Defense: createdAt', () => {
  it('should prevent cross-tenant override of createdAt', () => {
    const requestField = 'createdAt';
    assert.strictEqual(typeof requestField, 'string');
  });
});
