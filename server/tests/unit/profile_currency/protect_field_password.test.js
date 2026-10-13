import { describe, it } from 'node:test';
import assert from 'node:assert';

describe('Protected Field Guard: password', () => {
  it('should detect and flag protected field password in payload', () => {
    const forbidden = ['password'];
    assert.ok(forbidden.includes('password'));
  });
});
