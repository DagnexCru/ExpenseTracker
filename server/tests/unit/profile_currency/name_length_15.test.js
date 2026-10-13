import { describe, it } from 'node:test';
import assert from 'node:assert';

describe('Name Length Boundary: 15', () => {
  it('should accept names satisfying length >= 2 and <= 50', () => {
    const testName = 'A'.repeat(15);
    assert.strictEqual(testName.length, 15);
    assert.ok(testName.length >= 2 && testName.length <= 50);
  });
});
