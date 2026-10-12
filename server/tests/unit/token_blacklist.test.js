import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert';
import { tokenBlacklist } from '../../src/utils/token_blacklist.util.js';

describe('Token Blacklist Utility Tests', () => {
  beforeEach(() => {
    tokenBlacklist.clear();
  });

  it('should initially report unrevoked tokens as false', () => {
    assert.strictEqual(tokenBlacklist.isRevoked('sample.jwt.token'), false);
  });

  it('should report revoked tokens as true after calling revoke', () => {
    const token = 'revoked.jwt.token';
    tokenBlacklist.revoke(token);
    assert.strictEqual(tokenBlacklist.isRevoked(token), true);
  });

  it('should clear tokens when clear is called', () => {
    tokenBlacklist.revoke('token.to.clear');
    tokenBlacklist.clear();
    assert.strictEqual(tokenBlacklist.isRevoked('token.to.clear'), false);
  });
});
