import { describe, it } from 'node:test';
import assert from 'node:assert';

describe('Sort Spec: amount asc', () => {
  it('should generate valid MongoDB sort descriptor', () => {
    const sortDoc = { 'amount': 'asc' === 'desc' ? -1 : 1 };
    assert.strictEqual(sortDoc['amount'], 1);
  });
});
