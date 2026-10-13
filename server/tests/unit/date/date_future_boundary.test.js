import { describe, it } from 'node:test';
import assert from 'node:assert';
import { isValidDate, normalizeDate } from '../../../src/utils/date.util.js';

describe('Unit Date: date_future_boundary', () => {
  it('should validate date_future_boundary', () => {
    assert.strictEqual(isValidDate("2050-01-01"), false);
  });
});
