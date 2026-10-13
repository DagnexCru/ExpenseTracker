import { describe, it } from 'node:test';
import assert from 'node:assert';

describe('Pagination Math: Page 5', () => {
  it('should correctly calculate skip offset for limit 10', () => {
    const page = 5;
    const limit = 10;
    const skip = (page - 1) * limit;
    assert.strictEqual(skip, 40);
  });

  it('should correctly calculate skip offset for limit 25', () => {
    const page = 5;
    const limit = 25;
    const skip = (page - 1) * limit;
    assert.strictEqual(skip, 100);
  });
});
