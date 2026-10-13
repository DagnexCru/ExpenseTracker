import { describe, it } from 'node:test';
import assert from 'node:assert';
import { getCookieClearOptions } from '../../src/utils/cookie.util.js';

describe('Unit: Cookie Clearing Options', () => {
  it('should set httpOnly true and past expiration date for cookie invalidation', () => {
    const clearOpts = getCookieClearOptions();
    assert.strictEqual(clearOpts.httpOnly, true);
    assert.ok(clearOpts.expires instanceof Date);
    assert.ok(clearOpts.expires.getTime() <= Date.now());
  });
});
