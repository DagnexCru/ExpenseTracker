import { describe, it } from 'node:test';
import assert from 'node:assert';
import { getCookieOptions } from '../../src/utils/cookie.util.js';

describe('Unit: Cookie HttpOnly Flag', () => {
  it('should explicitly set httpOnly true to prevent client script access', () => {
    const options = getCookieOptions();
    assert.strictEqual(options.httpOnly, true);
  });
});
