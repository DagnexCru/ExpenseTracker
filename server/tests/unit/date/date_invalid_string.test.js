import { describe, it } from 'node:test';
import assert from 'node:assert';
import { isValidDate, normalizeDate } from '../../../src/utils/date.util.js';

describe('Unit Date: date_invalid_string', () => {
  it('should validate date_invalid_string', () => {
    assert.strictEqual(isValidDate("invalid-date"), false);
  });
});
