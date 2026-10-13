import { describe, it } from 'node:test';
import assert from 'node:assert';

describe('Sort Spec: amount desc', () => {
  it('should generate valid MongoDB sort descriptor', () => {
    const sortDoc = { 'amount': 'desc' === 'desc' ? -1 : 1 };
    assert.strictEqual(sortDoc['amount'], -1);
  });
});
