import http from 'http';
import mongoose from 'mongoose';
import app from '../src/app.js';
import User from '../src/models/User.js';
import { connectDB } from '../src/config/db.js';
import { generateToken } from '../src/utils/jwt.util.js';

const runEdgeCaseTests = async () => {
  console.log('🧪 Starting Auth Edge Cases & Negative Test Suite...');
  await connectDB();

  const testPort = 5003;
  const testServer = http.createServer(app);
  await new Promise((resolve) => testServer.listen(testPort, resolve));
  const baseUrl = `http://localhost:${testPort}/api/auth`;

  try {
    // Edge Case 1: Missing Name
    console.log('[1] Testing registration without name...');
    const r1 = await fetch(`${baseUrl}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'noname@example.com', password: 'Password123!' }),
    });
    if (r1.status !== 400) throw new Error(`Expected 400 for missing name, got ${r1.status}`);
    console.log('  ✅ 400 Bad Request on missing name');

    // Edge Case 2: Whitespace-only Name
    console.log('[2] Testing registration with whitespace-only name...');
    const r2 = await fetch(`${baseUrl}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: '   ', email: 'spaces@example.com', password: 'Password123!' }),
    });
    if (r2.status !== 400) throw new Error(`Expected 400 for whitespace name, got ${r2.status}`);
    console.log('  ✅ 400 Bad Request on whitespace name');

    // Edge Case 3: Malformed Email Missing @
    console.log('[3] Testing registration with email missing @...');
    const r3 = await fetch(`${baseUrl}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Bob', email: 'bobatexample.com', password: 'Password123!' }),
    });
    if (r3.status !== 400) throw new Error(`Expected 400 for malformed email, got ${r3.status}`);
    console.log('  ✅ 400 Bad Request on email missing @');

    // Edge Case 4: Malformed Email Missing Domain
    console.log('[4] Testing registration with email missing domain...');
    const r4 = await fetch(`${baseUrl}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Bob', email: 'bob@example', password: 'Password123!' }),
    });
    if (r4.status !== 400) throw new Error(`Expected 400 for domain-less email, got ${r4.status}`);
    console.log('  ✅ 400 Bad Request on email missing TLD');

    // Edge Case 5: Missing Password
    console.log('[5] Testing registration without password...');
    const r5 = await fetch(`${baseUrl}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Bob', email: 'nopass@example.com' }),
    });
    if (r5.status !== 400) throw new Error(`Expected 400 for missing password, got ${r5.status}`);
    console.log('  ✅ 400 Bad Request on missing password');

    // Edge Case 6: Login Missing Email
    console.log('[6] Testing login with missing email...');
    const r6 = await fetch(`${baseUrl}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: 'Password123!' }),
    });
    if (r6.status !== 400) throw new Error(`Expected 400 for login without email, got ${r6.status}`);
    console.log('  ✅ 400 Bad Request on login missing email');

    // Edge Case 7: Login Missing Password
    console.log('[7] Testing login with missing password...');
    const r7 = await fetch(`${baseUrl}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'user@example.com' }),
    });
    if (r7.status !== 400) throw new Error(`Expected 400 for login without password, got ${r7.status}`);
    console.log('  ✅ 400 Bad Request on login missing password');

    // Edge Case 8: Login Non-Existent User
    console.log('[8] Testing login with non-existent email...');
    const r8 = await fetch(`${baseUrl}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'ghost_user_does_not_exist@example.com', password: 'Password123!' }),
    });
    if (r8.status !== 401) throw new Error(`Expected 401 for non-existent user, got ${r8.status}`);
    console.log('  ✅ 401 Unauthorized on non-existent account');

    // Edge Case 9: Tampered JWT Cookie
    console.log('[9] Testing protected endpoint with tampered JWT cookie...');
    const r9 = await fetch(`${baseUrl}/me`, {
      method: 'GET',
      headers: { Cookie: 'token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.tampered.signature' },
    });
    if (r9.status !== 401) throw new Error(`Expected 401 for tampered token, got ${r9.status}`);
    console.log('  ✅ 401 Unauthorized on tampered token signature');

    // Edge Case 10: Bearer Token Authorization Fallback
    console.log('[10] Testing Authorization: Bearer <token> fallback support...');
    const tempUser = await User.create({
      name: 'Bearer User',
      email: `bearer_${Date.now()}@example.com`,
      password: 'SecurePassword123!',
    });
    const validBearerToken = generateToken({ id: tempUser._id, email: tempUser.email });

    const r10 = await fetch(`${baseUrl}/me`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${validBearerToken}` },
    });
    const d10 = await r10.json();
    if (r10.status !== 200 || !d10.success) {
      throw new Error(`Expected 200 with Bearer header, got ${r10.status}`);
    }
    console.log('  ✅ 200 OK: Authorization: Bearer <token> header fallback works perfectly');

    await User.deleteOne({ _id: tempUser._id });

    console.log('🎉 10/10 Edge Cases & Negative Security Tests Passed!\n');
  } finally {
    testServer.close();
    await mongoose.connection.close();
  }
};

runEdgeCaseTests().catch((err) => {
  console.error('❌ Edge Case Test Failure:', err.message);
  process.exit(1);
});
