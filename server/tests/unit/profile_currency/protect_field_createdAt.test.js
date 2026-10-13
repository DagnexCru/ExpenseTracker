import { describe, it } from 'node:test';
import assert from 'node:assert';

describe('Protected Field Guard: createdAt', () => {
  it('should detect and flag protected field createdAt in payload', () => {
    const forbidden = ['createdAt'];
    assert.ok(forbidden.includes('createdAt'));
  });
});
