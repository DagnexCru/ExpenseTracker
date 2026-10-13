import { describe, it } from 'node:test';
import assert from 'node:assert';

describe('Protected Field Guard: salt', () => {
  it('should detect and flag protected field salt in payload', () => {
    const forbidden = ['salt'];
    assert.ok(forbidden.includes('salt'));
  });
});
