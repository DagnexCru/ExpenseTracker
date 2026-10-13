import { describe, it } from 'node:test';
import assert from 'node:assert';
import { getCookieOptions } from '../../src/utils/cookie.util.js';

describe('Unit: Cookie SameSite Policy', () => {
  it('should enforce sameSite lax policy on authentication cookies', () => {
    const options = getCookieOptions();
    assert.strictEqual(options.sameSite, 'lax');
  });
});
