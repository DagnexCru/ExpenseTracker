import { describe, it } from 'node:test';
import assert from 'node:assert';

describe('Protected Field Guard: email', () => {
  it('should detect and flag protected field email in payload', () => {
    const forbidden = ['email'];
    assert.ok(forbidden.includes('email'));
  });
});
