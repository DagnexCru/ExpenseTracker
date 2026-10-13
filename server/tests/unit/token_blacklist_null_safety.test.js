import { describe, it } from 'node:test';
import assert from 'node:assert';
import { tokenBlacklist } from '../../src/utils/token_blacklist.util.js';

describe('Unit: Token Blacklist Null Safety', () => {
  it('should return false safely when null or non-string token is queried', () => {
    assert.strictEqual(tokenBlacklist.isRevoked(null), false);
    assert.strictEqual(tokenBlacklist.isRevoked(undefined), false);
    assert.strictEqual(tokenBlacklist.isRevoked(12345), false);
  });
});
