import { generateToken, verifyToken } from '../../src/utils/jwt.util.js';

const test = () => {
  const payload = { id: 'u_123', email: 'verified@mail.com' };
  const token = generateToken(payload);
  const decoded = verifyToken(token);
  if (decoded.id !== payload.id || decoded.email !== payload.email) {
    throw new Error('verifyToken payload mismatch');
  }
  console.log('✅ Unit Test Passed: jwt_verification');
};

test();
