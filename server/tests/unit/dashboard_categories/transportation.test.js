import { describe, it } from 'node:test';
import assert from 'node:assert';

describe('Dashboard Category Math: Transportation', () => {
  it('should correctly calculate proportion and 1-decimal percentage', () => {
    const totalAmount = 10000;
    const catAmount = 2500;
    const percentage = Math.round((catAmount / totalAmount) * 1000) / 10;
    assert.strictEqual(percentage, 25.0);
  });
});
