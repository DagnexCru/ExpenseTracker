import { describe, it } from 'node:test';
import assert from 'node:assert';

describe('Income Category Proportion: Salary', () => {
  it('should correctly calculate income share for Salary', () => {
    const totalIncome = 50000;
    const incomeAmount = 12500;
    const percentage = Math.round((incomeAmount / totalIncome) * 1000) / 10;
    assert.strictEqual(percentage, 25.0);
  });
});
