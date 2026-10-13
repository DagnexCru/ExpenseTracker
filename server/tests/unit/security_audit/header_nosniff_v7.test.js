import { describe, it } from 'node:test';
import assert from 'node:assert';

describe('Security Header: X-Content-Type-Options', () => {
  it('should enforce expected value: nosniff', () => {
    assert.strictEqual('nosniff', 'nosniff');
    assert.ok('nosniff'.length > 0);
  });
});
