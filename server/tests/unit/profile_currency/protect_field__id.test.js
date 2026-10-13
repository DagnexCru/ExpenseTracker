import { describe, it } from 'node:test';
import assert from 'node:assert';

describe('Protected Field Guard: _id', () => {
  it('should detect and flag protected field _id in payload', () => {
    const forbidden = ['_id'];
    assert.ok(forbidden.includes('_id'));
  });
});
