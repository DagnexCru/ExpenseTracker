import { describe, it } from 'node:test';
import assert from 'node:assert';
import { sanitizeEmail } from '../../src/utils/sanitizer.util.js';

describe('Unit: Email Trimming and Normalization', () => {
  it('should trim surrounding whitespace from email', () => {
    assert.strictEqual(sanitizeEmail('   user@spendwise.et   '), 'user@spendwise.et');
  });
});
