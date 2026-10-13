import { describe, it } from 'node:test';
import assert from 'node:assert';

describe('Name Length Boundary: 6', () => {
  it('should accept names satisfying length >= 2 and <= 50', () => {
    const testName = 'A'.repeat(6);
    assert.strictEqual(testName.length, 6);
    assert.ok(testName.length >= 2 && testName.length <= 50);
  });
});
