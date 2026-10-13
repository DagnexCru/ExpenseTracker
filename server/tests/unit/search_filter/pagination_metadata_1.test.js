import { describe, it } from 'node:test';
import assert from 'node:assert';

describe('Pagination Metadata: Page 1', () => {
  it('should correctly determine navigation flags', () => {
    const page = 1;
    const totalPages = 20;
    const hasPrev = page > 1;
    const hasNext = page < totalPages;
    assert.strictEqual(hasPrev, false);
    assert.strictEqual(hasNext, true);
  });
});
