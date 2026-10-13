import { describe, it } from 'node:test';
import assert from 'node:assert';
import { isValidDate, normalizeDate } from '../../../src/utils/date.util.js';

describe('Unit Date: date_simple_string', () => {
  it('should validate date_simple_string', () => {
    assert.strictEqual(isValidDate("2026-10-12"), true);
  });
});
