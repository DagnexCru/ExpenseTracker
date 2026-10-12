import { describe, it } from 'node:test';
import assert from 'node:assert';
import { sanitizeEmail, sanitizeName } from '../../src/utils/sanitizer.util.js';

describe('Sanitizer Utility Tests', () => {
  it('should trim and lowercase email addresses correctly', () => {
    assert.strictEqual(sanitizeEmail('  JOHN.DOE@Example.COM  '), 'john.doe@example.com');
    assert.strictEqual(sanitizeEmail('user@domain.org'), 'user@domain.org');
    assert.strictEqual(sanitizeEmail(null), '');
    assert.strictEqual(sanitizeEmail(123), '');
  });

  it('should strip HTML tags and collapse whitespace in names', () => {
    assert.strictEqual(sanitizeName('  <b>John</b>   Doe  '), 'John Doe');
    assert.strictEqual(sanitizeName('<script>alert("xss")</script>Alice'), 'alert("xss")Alice');
    assert.strictEqual(sanitizeName('  Abebe   Bikila  '), 'Abebe Bikila');
    assert.strictEqual(sanitizeName(undefined), '');
  });
});
