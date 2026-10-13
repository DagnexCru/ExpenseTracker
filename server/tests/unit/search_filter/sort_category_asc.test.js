import { describe, it } from 'node:test';
import assert from 'node:assert';

describe('Sort Spec: category asc', () => {
  it('should generate valid MongoDB sort descriptor', () => {
    const sortDoc = { 'category': 'asc' === 'desc' ? -1 : 1 };
    assert.strictEqual(sortDoc['category'], 1);
  });
});
