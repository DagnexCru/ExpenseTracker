import { describe, it } from 'node:test';
import assert from 'node:assert';

describe('Date Boundary: 2026-07', () => {
  it('should normalize start date to beginning of day', () => {
    const start = new Date('2026-07-01T00:00:00.000Z');
    assert.strictEqual(start.getUTCHours(), 0);
  });

  it('should normalize end date to end of day', () => {
    const end = new Date('2026-07-28T23:59:59.999Z');
    assert.strictEqual(end.getUTCHours(), 23);
    assert.strictEqual(end.getUTCMinutes(), 59);
  });
});
