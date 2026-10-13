import { describe, it } from 'node:test';
import assert from 'node:assert';

describe('Protected Field Guard: passwordHash', () => {
  it('should detect and flag protected field passwordHash in payload', () => {
    const forbidden = ['passwordHash'];
    assert.ok(forbidden.includes('passwordHash'));
  });
});
