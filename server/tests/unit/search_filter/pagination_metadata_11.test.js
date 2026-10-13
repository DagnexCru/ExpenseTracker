import { describe, it } from 'node:test';
import assert from 'node:assert';

describe('Pagination Metadata: Page 11', () => {
  it('should correctly determine navigation flags', () => {
    const page = 11;
    const totalPages = 20;
    const hasPrev = page > 1;
    const hasNext = page < totalPages;
    assert.strictEqual(hasPrev, true);
    assert.strictEqual(hasNext, true);
  });
});
