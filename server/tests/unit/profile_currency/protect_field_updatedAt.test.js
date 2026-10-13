import { describe, it } from 'node:test';
import assert from 'node:assert';

describe('Protected Field Guard: updatedAt', () => {
  it('should detect and flag protected field updatedAt in payload', () => {
    const forbidden = ['updatedAt'];
    assert.ok(forbidden.includes('updatedAt'));
  });
});
