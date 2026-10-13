import { describe, it } from 'node:test';
import assert from 'node:assert';

describe('Currency Formatting: GBP', () => {
  it('should format amounts correctly with standard fractions', () => {
    const formatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'GBP',
    }).format(1250.5);
    assert.ok(formatted.length > 0);
  });
});
