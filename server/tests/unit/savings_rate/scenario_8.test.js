import { describe, it } from 'node:test';
import assert from 'node:assert';

describe('Savings Rate Scenario 8', () => {
  it('should compute exact savings rate percentage', () => {
    const income = 80000;
    const expenses = 48000;
    const rate = Math.round(((income - expenses) / income) * 1000) / 10;
    assert.strictEqual(rate, 40);
  });
});
