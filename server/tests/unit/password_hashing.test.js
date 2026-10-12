import { hashPassword } from '../../src/utils/password.util.js';

const test = async () => {
  const hash = await hashPassword('TestP@ss123');
  if (!hash.startsWith('$2')) {
    throw new Error('hashPassword did not produce a valid bcrypt hash');
  }
  console.log('✅ Unit Test Passed: password_hashing');
};

test().catch((e) => {
  console.error(e);
  process.exit(1);
});
