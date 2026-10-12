import { describe, it } from 'node:test';
import assert from 'node:assert';
import { calculatePasswordStrength } from '../../src/utils/password_entropy.util.js';

describe('Password Entropy Utility Tests', () => {
  it('should score 0 for empty or invalid passwords', () => {
    assert.strictEqual(calculatePasswordStrength('').score, 0);
    assert.strictEqual(calculatePasswordStrength(null).score, 0);
  });

  it('should evaluate complex passwords with high score', () => {
    const result = calculatePasswordStrength('StrongP@ssw0rd!');
    assert.strictEqual(result.score, 4);
    assert.strictEqual(result.label, 'Strong');
    assert.strictEqual(result.hasUppercase, true);
    assert.strictEqual(result.hasSpecial, true);
  });

  it('should evaluate simple lowercase short password as weak', () => {
    const result = calculatePasswordStrength('abc');
    assert.strictEqual(result.score, 0);
    assert.strictEqual(result.hasMinLength, false);
  });
});
