import { describe, it } from 'node:test';
import assert from 'node:assert';
import { validateRegister } from '../../src/validators/auth.validator.js';

describe('Unit: Name Whitespace-Only Validation', () => {
  it('should reject names containing only whitespace characters', () => {
    const result = validateRegister({
      name: '     ',
      email: 'user@spendwise.et',
      password: 'Password123!',
    });
    assert.strictEqual(result.isValid, false);
    assert.ok(result.errors.some(e => e.field === 'name'));
  });
});
