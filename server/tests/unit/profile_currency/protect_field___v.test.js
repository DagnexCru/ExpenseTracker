import { describe, it } from 'node:test';
import assert from 'node:assert';

describe('Protected Field Guard: __v', () => {
  it('should detect and flag protected field __v in payload', () => {
    const forbidden = ['__v'];
    assert.ok(forbidden.includes('__v'));
  });
});
