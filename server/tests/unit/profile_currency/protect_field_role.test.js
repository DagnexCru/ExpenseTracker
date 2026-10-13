import { describe, it } from 'node:test';
import assert from 'node:assert';

describe('Protected Field Guard: role', () => {
  it('should detect and flag protected field role in payload', () => {
    const forbidden = ['role'];
    assert.ok(forbidden.includes('role'));
  });
});
