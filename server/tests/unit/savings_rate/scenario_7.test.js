import { describe, it } from 'node:test';
import assert from 'node:assert';

describe('Savings Rate Scenario 7', () => {
  it('should compute exact savings rate percentage', () => {
    const income = 70000;
    const expenses = 42000;
    const rate = Math.round(((income - expenses) / income) * 1000) / 10;
    assert.strictEqual(rate, 40);
  });
});
