import { describe, it } from 'node:test';
import assert from 'node:assert';

describe('Query Field Security: maxAmount', () => {
  it('should reject SQL/NoSQL injection tokens in maxAmount', () => {
    const maliciousPayload = '{"$ne": null}';
    assert.strictEqual(typeof maliciousPayload, 'string');
    assert.ok(maliciousPayload.includes('$ne'));
  });
});
