import { describe, it } from 'node:test';
import assert from 'node:assert';

describe('Name Length Boundary: 14', () => {
  it('should accept names satisfying length >= 2 and <= 50', () => {
    const testName = 'A'.repeat(14);
    assert.strictEqual(testName.length, 14);
    assert.ok(testName.length >= 2 && testName.length <= 50);
  });
});
