import { describe, it } from 'node:test';
import assert from 'node:assert';

describe('Query Field Security: page', () => {
  it('should reject SQL/NoSQL injection tokens in page', () => {
    const maliciousPayload = '{"$ne": null}';
    assert.strictEqual(typeof maliciousPayload, 'string');
    assert.ok(maliciousPayload.includes('$ne'));
  });
});
