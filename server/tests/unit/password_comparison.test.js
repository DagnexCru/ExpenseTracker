import { hashPassword, comparePassword } from '../../src/utils/password.util.js';

const test = async () => {
  const pwd = 'TestCompare123!';
  const hash = await hashPassword(pwd);
  const match = await comparePassword(pwd, hash);
  const noMatch = await comparePassword('DifferentPassword', hash);
  if (!match || noMatch) {
    throw new Error('comparePassword assertion failed');
  }
  console.log('✅ Unit Test Passed: password_comparison');
};

test().catch((e) => {
  console.error(e);
  process.exit(1);
});
