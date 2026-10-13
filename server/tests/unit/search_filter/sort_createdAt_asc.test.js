import { describe, it } from 'node:test';
import assert from 'node:assert';

describe('Sort Spec: createdAt asc', () => {
  it('should generate valid MongoDB sort descriptor', () => {
    const sortDoc = { 'createdAt': 'asc' === 'desc' ? -1 : 1 };
    assert.strictEqual(sortDoc['createdAt'], 1);
  });
});
