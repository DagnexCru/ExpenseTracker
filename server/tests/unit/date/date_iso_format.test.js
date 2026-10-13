import { describe, it } from 'node:test';
import assert from 'node:assert';
import { isValidDate, normalizeDate } from '../../../src/utils/date.util.js';

describe('Unit Date: date_iso_format', () => {
  it('should validate date_iso_format', () => {
    assert.strictEqual(isValidDate("2026-10-12T10:00:00.000Z"), true);
  });
});
