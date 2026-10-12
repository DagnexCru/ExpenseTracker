import { generateToken } from '../../src/utils/jwt.util.js';

const test = () => {
  const token = generateToken({ id: 'u_1', email: 'test@mail.com' });
  if (!token || typeof token !== 'string') {
    throw new Error('generateToken failed');
  }
  console.log('✅ Unit Test Passed: jwt_generation');
};

test();
