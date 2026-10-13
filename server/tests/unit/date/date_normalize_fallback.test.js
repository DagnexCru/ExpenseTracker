import { describe, it } from 'node:test';
import assert from 'node:assert';
import { isValidDate, normalizeDate } from '../../../src/utils/date.util.js';

describe('Unit Date: date_normalize_fallback', () => {
  it('should validate date_normalize_fallback', () => {
    assert.strictEqual(normalizeDate(null) instanceof Date, true);
  });
});
