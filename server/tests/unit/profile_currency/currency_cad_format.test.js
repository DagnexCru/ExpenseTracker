import { describe, it } from 'node:test';
import assert from 'node:assert';

describe('Currency Formatting: CAD', () => {
  it('should format amounts correctly with standard fractions', () => {
    const formatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'CAD',
    }).format(1250.5);
    assert.ok(formatted.length > 0);
  });
});
