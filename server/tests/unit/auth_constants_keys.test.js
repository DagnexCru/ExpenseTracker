import { describe, it } from 'node:test';
import assert from 'node:assert';
import { AUTH_ERROR_CODES } from '../../src/constants/auth.constants.js';

describe('Unit: Auth Error Codes Completeness', () => {
  it('should define all 6 required auth error codes', () => {
    const keys = Object.keys(AUTH_ERROR_CODES);
    assert.ok(keys.includes('VALIDATION_ERROR'));
    assert.ok(keys.includes('EMAIL_ALREADY_EXISTS'));
    assert.ok(keys.includes('INVALID_CREDENTIALS'));
    assert.ok(keys.includes('UNAUTHORIZED'));
    assert.ok(keys.includes('INVALID_TOKEN'));
    assert.ok(keys.includes('RATE_LIMIT_EXCEEDED'));
  });
});
