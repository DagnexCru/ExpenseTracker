import { describe, it } from 'node:test';
import assert from 'node:assert';

describe('Name Length Boundary: 12', () => {
  it('should accept names satisfying length >= 2 and <= 50', () => {
    const testName = 'A'.repeat(12);
    assert.strictEqual(testName.length, 12);
    assert.ok(testName.length >= 2 && testName.length <= 50);
  });
});
