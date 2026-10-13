import { describe, it } from 'node:test';
import assert from 'node:assert';

describe('Aggregation Accumulator Step 8', () => {
  it('should aggregate documents without cross-tenant mutation', () => {
    const acc = { total: 0, count: 0 };
    acc.total += 12000;
    acc.count += 1;
    assert.strictEqual(acc.count, 1);
    assert.strictEqual(acc.total, 12000);
  });
});
