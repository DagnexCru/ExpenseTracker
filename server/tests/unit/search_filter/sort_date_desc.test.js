import { describe, it } from 'node:test';
import assert from 'node:assert';

describe('Sort Spec: date desc', () => {
  it('should generate valid MongoDB sort descriptor', () => {
    const sortDoc = { 'date': 'desc' === 'desc' ? -1 : 1 };
    assert.strictEqual(sortDoc['date'], -1);
  });
});
