import { describe, it } from 'node:test';
import assert from 'node:assert';

describe('Savings Rate Scenario 6', () => {
  it('should compute exact savings rate percentage', () => {
    const income = 60000;
    const expenses = 36000;
    const rate = Math.round(((income - expenses) / income) * 1000) / 10;
    assert.strictEqual(rate, 40);
  });
});
