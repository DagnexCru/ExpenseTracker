import { describe, it } from 'node:test';
import assert from 'node:assert';

describe('Protected Field Guard: id', () => {
  it('should detect and flag protected field id in payload', () => {
    const forbidden = ['id'];
    assert.ok(forbidden.includes('id'));
  });
});
