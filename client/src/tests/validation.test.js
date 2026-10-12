import { describe, it } from 'node:test';
import assert from 'node:assert';
import { validateRegisterForm, validateLoginForm } from '../utils/validation.js';

describe('Client Validation Utility Tests', () => {
  it('should validate complete and correct registration data', () => {
    const result = validateRegisterForm({
      name: 'Abebe Bikila',
      email: 'abebe.test@spendwise.et',
      password: 'Password123!',
    });
    assert.strictEqual(result.isValid, true);
    assert.strictEqual(Object.keys(result.errors).length, 0);
  });

  it('should reject short name and invalid email in registration form', () => {
    const result = validateRegisterForm({
      name: 'A',
      email: 'bad-email-format',
      password: '123',
    });
    assert.strictEqual(result.isValid, false);
    assert.ok(result.errors.name);
    assert.ok(result.errors.email);
    assert.ok(result.errors.password);
  });

  it('should validate valid login form data', () => {
    const result = validateLoginForm({
      email: 'user@spendwise.et',
      password: 'SomePassword',
    });
    assert.strictEqual(result.isValid, true);
  });

  it('should reject missing email or password in login form', () => {
    const result = validateLoginForm({
      email: '',
      password: '',
    });
    assert.strictEqual(result.isValid, false);
    assert.ok(result.errors.email);
    assert.ok(result.errors.password);
  });
});
