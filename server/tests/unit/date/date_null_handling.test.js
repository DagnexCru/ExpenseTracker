import { describe, it } from 'node:test';
import assert from 'node:assert';
import { isValidDate, normalizeDate } from '../../../src/utils/date.util.js';

describe('Unit Date: date_null_handling', () => {
  it('should validate date_null_handling', () => {
    assert.strictEqual(isValidDate(null), false);
  });
});
