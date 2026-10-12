import { getCookieOptions } from '../../src/utils/cookie.util.js';

const test = () => {
  const opts = getCookieOptions();
  if (!opts.httpOnly) throw new Error('Cookie must be httpOnly');
  if (opts.path !== '/') throw new Error('Cookie path must be root');
  if (!opts.maxAge || opts.maxAge <= 0) throw new Error('Cookie maxAge must be positive');
  console.log('✅ Unit Test Passed: cookie_options');
};

test();
