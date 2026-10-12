import { describe, it } from 'node:test';
import assert from 'node:assert';
import { AUTH_ERROR_CODES, JWT_CONFIG } from '../../src/constants/auth.constants.js';

describe('Auth Constants Immutability Tests', () => {
  it('should be frozen against mutations', () => {
    assert.throws(() => {
      AUTH_ERROR_CODES.NEW_CODE = 'MUTATION';
    });
    assert.throws(() => {
      JWT_CONFIG.COOKIE_NAME = 'MUTATION';
    });
  });

  it('should have expected constant keys', () => {
    assert.strictEqual(AUTH_ERROR_CODES.INVALID_CREDENTIALS, 'INVALID_CREDENTIALS');
    assert.strictEqual(JWT_CONFIG.COOKIE_NAME, 'token');
  });
});
