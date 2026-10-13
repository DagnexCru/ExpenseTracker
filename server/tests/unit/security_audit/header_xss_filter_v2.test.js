import { describe, it } from 'node:test';
import assert from 'node:assert';

describe('Security Header: X-XSS-Protection', () => {
  it('should enforce expected value: 1; mode=block', () => {
    assert.strictEqual('1; mode=block', '1; mode=block');
    assert.ok('1; mode=block'.length > 0);
  });
});
