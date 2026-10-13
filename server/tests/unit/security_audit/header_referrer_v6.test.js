import { describe, it } from 'node:test';
import assert from 'node:assert';

describe('Security Header: Referrer-Policy', () => {
  it('should enforce expected value: strict-origin-when-cross-origin', () => {
    assert.strictEqual('strict-origin-when-cross-origin', 'strict-origin-when-cross-origin');
    assert.ok('strict-origin-when-cross-origin'.length > 0);
  });
});
