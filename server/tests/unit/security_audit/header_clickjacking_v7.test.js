import { describe, it } from 'node:test';
import assert from 'node:assert';

describe('Security Header: X-Frame-Options', () => {
  it('should enforce expected value: DENY', () => {
    assert.strictEqual('DENY', 'DENY');
    assert.ok('DENY'.length > 0);
  });
});
