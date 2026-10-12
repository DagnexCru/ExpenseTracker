import { describe, it } from 'node:test';
import assert from 'node:assert';
import { getPasswordStrength } from '../utils/passwordStrength.js';

describe('Client Password Strength Utility Tests', () => {
  it('should score 0 for empty password', () => {
    const result = getPasswordStrength('');
    assert.strictEqual(result.score, 0);
    assert.strictEqual(result.label, 'Too Short');
  });

  it('should score higher for diverse character sets', () => {
    const result = getPasswordStrength('ComplexP@ss123');
    assert.strictEqual(result.score, 4);
    assert.strictEqual(result.label, 'Strong');
    assert.strictEqual(result.rules.special, true);
    assert.strictEqual(result.rules.number, true);
  });
});
