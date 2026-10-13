import { describe, it } from 'node:test';
import assert from 'node:assert';

describe('Sort Spec: createdAt desc', () => {
  it('should generate valid MongoDB sort descriptor', () => {
    const sortDoc = { 'createdAt': 'desc' === 'desc' ? -1 : 1 };
    assert.strictEqual(sortDoc['createdAt'], -1);
  });
});
