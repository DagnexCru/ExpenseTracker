import { describe, it } from 'node:test';
import assert from 'node:assert';
import { isValidDate, normalizeDate } from '../../../src/utils/date.util.js';

describe('Unit Date: date_past_boundary', () => {
  it('should validate date_past_boundary', () => {
    assert.strictEqual(isValidDate("1995-01-01"), false);
  });
});
