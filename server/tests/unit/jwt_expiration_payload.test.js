import { describe, it } from 'node:test';
import assert from 'node:assert';
import jwt from 'jsonwebtoken';
import { generateToken } from '../../src/utils/jwt.util.js';

describe('Unit: JWT Expiration Claim Validation', () => {
  it('should issue tokens with exp claim approximately 7 days in the future', () => {
    const token = generateToken('user123456');
    const decoded = jwt.decode(token);
    const nowInSeconds = Math.floor(Date.now() / 1000);
    const diffDays = (decoded.exp - nowInSeconds) / (60 * 60 * 24);
    assert.ok(diffDays >= 6.9 && diffDays <= 7.1, 'Token exp should be ~7 days');
  });
});
