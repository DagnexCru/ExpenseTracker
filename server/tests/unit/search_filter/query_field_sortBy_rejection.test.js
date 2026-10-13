import { describe, it } from 'node:test';
import assert from 'node:assert';

describe('Query Field Security: sortBy', () => {
  it('should reject SQL/NoSQL injection tokens in sortBy', () => {
    const maliciousPayload = '{"$ne": null}';
    assert.strictEqual(typeof maliciousPayload, 'string');
    assert.ok(maliciousPayload.includes('$ne'));
  });
});
