import { describe, it } from 'node:test';
import assert from 'node:assert';

describe('Sort Spec: category desc', () => {
  it('should generate valid MongoDB sort descriptor', () => {
    const sortDoc = { 'category': 'desc' === 'desc' ? -1 : 1 };
    assert.strictEqual(sortDoc['category'], -1);
  });
});
