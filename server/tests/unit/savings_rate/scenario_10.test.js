import { describe, it } from 'node:test';
import assert from 'node:assert';

describe('Savings Rate Scenario 10', () => {
  it('should compute exact savings rate percentage', () => {
    const income = 100000;
    const expenses = 60000;
    const rate = Math.round(((income - expenses) / income) * 1000) / 10;
    assert.strictEqual(rate, 40);
  });
});
