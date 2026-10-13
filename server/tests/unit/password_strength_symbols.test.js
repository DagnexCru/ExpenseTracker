import { describe, it } from 'node:test';
import assert from 'node:assert';
import { calculatePasswordStrength } from '../../src/utils/password_entropy.util.js';

describe('Unit: Password Strength Symbol Detection', () => {
  it('should flag hasSpecial true when special characters are included', () => {
    const res = calculatePasswordStrength('Password123#');
    assert.strictEqual(res.hasSpecial, true);
  });
});
