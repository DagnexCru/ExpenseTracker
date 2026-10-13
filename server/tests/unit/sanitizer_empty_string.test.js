import { describe, it } from 'node:test';
import assert from 'node:assert';
import { sanitizeName, sanitizeEmail } from '../../src/utils/sanitizer.util.js';

describe('Unit: Sanitizer Empty Inputs', () => {
  it('should return empty string when empty inputs are sanitized', () => {
    assert.strictEqual(sanitizeName(''), '');
    assert.strictEqual(sanitizeEmail(''), '');
  });
});
