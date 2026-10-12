import { hashPassword, comparePassword } from '../src/utils/password.util.js';
import { generateToken, verifyToken } from '../src/utils/jwt.util.js';
import { getCookieOptions } from '../src/utils/cookie.util.js';

const runUtilTests = async () => {
  console.log('🧪 Starting Auth Utilities Unit Tests...');

  // 1. Password Hashing Test
  const rawPassword = 'SecretPassword123!';
  const hash = await hashPassword(rawPassword);

  if (!hash || hash === rawPassword) {
    throw new Error('hashPassword failed to hash password properly');
  }
  console.log('  ✅ hashPassword created valid bcrypt salt hash');

  const isMatch = await comparePassword(rawPassword, hash);
  if (!isMatch) {
    throw new Error('comparePassword failed on valid password');
  }
  console.log('  ✅ comparePassword correctly validated matching password');

  const isBadMatch = await comparePassword('WrongPassword', hash);
  if (isBadMatch) {
    throw new Error('comparePassword falsely validated wrong password');
  }
  console.log('  ✅ comparePassword correctly rejected invalid password');

  // 2. JWT Signing & Verification Test
  const payload = { id: 'user_12345', email: 'test@example.com' };
  const token = generateToken(payload, '1h');

  if (!token || typeof token !== 'string') {
    throw new Error('generateToken failed to return string token');
  }
  console.log('  ✅ generateToken created signed JWT string');

  const decoded = verifyToken(token);
  if (decoded.id !== payload.id || decoded.email !== payload.email) {
    throw new Error('verifyToken payload mismatch');
  }
  console.log('  ✅ verifyToken successfully validated signature and decoded claims');

  // 3. Cookie Options Test
  const cookieOpts = getCookieOptions();
  if (!cookieOpts.httpOnly || cookieOpts.path !== '/') {
    throw new Error('Cookie options missing httpOnly or root path');
  }
  console.log('  ✅ getCookieOptions generated secure httpOnly cookie flags');

  console.log('🎉 All Auth Utilities Unit Tests Passed!\n');
};

runUtilTests().catch((err) => {
  console.error('❌ Utility Unit Test Failure:', err.message);
  process.exit(1);
});
