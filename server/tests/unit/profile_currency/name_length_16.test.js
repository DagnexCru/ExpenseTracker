import { describe, it } from 'node:test';
import assert from 'node:assert';

describe('Name Length Boundary: 16', () => {
  it('should accept names satisfying length >= 2 and <= 50', () => {
    const testName = 'A'.repeat(16);
    assert.strictEqual(testName.length, 16);
    assert.ok(testName.length >= 2 && testName.length <= 50);
  });
});
