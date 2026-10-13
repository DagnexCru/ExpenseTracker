import { describe, it } from 'node:test';
import assert from 'node:assert';

describe('Pagination Math: Page 12', () => {
  it('should correctly calculate skip offset for limit 10', () => {
    const page = 12;
    const limit = 10;
    const skip = (page - 1) * limit;
    assert.strictEqual(skip, 110);
  });

  it('should correctly calculate skip offset for limit 25', () => {
    const page = 12;
    const limit = 25;
    const skip = (page - 1) * limit;
    assert.strictEqual(skip, 275);
  });
});
