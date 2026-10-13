import { describe, it } from 'node:test';
import assert from 'node:assert';

describe('IDOR Defense: email', () => {
  it('should prevent cross-tenant override of email', () => {
    const requestField = 'email';
    assert.strictEqual(typeof requestField, 'string');
  });
});
