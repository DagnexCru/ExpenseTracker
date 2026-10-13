import { describe, it } from 'node:test';
import assert from 'node:assert';
import { isValidDate, normalizeDate } from '../../src/utils/date.util.js';

describe('Unit: Transaction Date Validation', () => {
  it('should accept valid ISO date strings', () => {
    assert.strictEqual(isValidDate('2026-10-12'), true);
    assert.strictEqual(isValidDate(new Date().toISOString()), true);
  });

  it('should reject invalid date strings and null/undefined', () => {
    assert.strictEqual(isValidDate('not-a-date'), false);
    assert.strictEqual(isValidDate(null), false);
    assert.strictEqual(isValidDate(''), false);
  });

  it('should normalize invalid dates to current Date fallback', () => {
    const fallback = normalizeDate('invalid-string');
    assert.ok(fallback instanceof Date);
    assert.ok(!isNaN(fallback.getTime()));
  });
});
