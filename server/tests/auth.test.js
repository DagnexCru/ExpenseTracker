import http from 'http';
import mongoose from 'mongoose';
import app from '../src/app.js';
import User from '../src/models/User.js';
import { connectDB } from '../src/config/db.js';

const runAuthIntegrationTests = async () => {
  console.log('🧪 Starting Full Auth API Integration Test Suite...');
  await connectDB();

  const testPort = 5002;
  const testServer = http.createServer(app);
  await new Promise((resolve) => testServer.listen(testPort, resolve));
  const baseUrl = `http://localhost:${testPort}/api/auth`;

  const uniqueSuffix = Date.now();
  const testUser = {
    name: 'Alice Developer',
    email: `alice_${uniqueSuffix}@example.com`,
    password: 'SecurePassword123!',
  };

  let authCookie = null;

  try {
    // -------------------------------------------------------------
    // Test 1: Successful Registration
    // -------------------------------------------------------------
    console.log('\n[1] Testing POST /api/auth/register with valid payload...');
    const regRes = await fetch(`${baseUrl}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser),
    });
    const regData = await regRes.json();

    if (regRes.status !== 201 || !regData.success) {
      throw new Error(`Registration failed: ${JSON.stringify(regData)}`);
    }
    if (regData.data.user.password) {
      throw new Error('Security flaw: registration response leaked password hash!');
    }
    // Extract set-cookie header
    const rawCookie = regRes.headers.get('set-cookie');
    if (!rawCookie || !rawCookie.includes('token=')) {
      throw new Error('Registration response did not attach HTTP-only auth token cookie');
    }
    authCookie = rawCookie.split(';')[0]; // Extract 'token=...'
    console.log('  ✅ 201 Created: User registered successfully and received HTTP-only auth cookie');

    // -------------------------------------------------------------
    // Test 2: Reject Duplicate Email Registration
    // -------------------------------------------------------------
    console.log('\n[2] Testing duplicate email registration conflict...');
    const dupRes = await fetch(`${baseUrl}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser),
    });
    const dupData = await dupRes.json();

    if (dupRes.status !== 409 || dupData.success) {
      throw new Error(`Duplicate registration should return 409 Conflict. Got: ${dupRes.status}`);
    }
    console.log('  ✅ 409 Conflict: Prevented duplicate account registration');

    // -------------------------------------------------------------
    // Test 3: Reject Weak Password
    // -------------------------------------------------------------
    console.log('\n[3] Testing short password rejection...');
    const weakRes = await fetch(`${baseUrl}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Bob Weak',
        email: `bob_${uniqueSuffix}@example.com`,
        password: '123',
      }),
    });
    const weakData = await weakRes.json();

    if (weakRes.status !== 400 || weakData.success) {
      throw new Error(`Short password should return 400 Bad Request. Got: ${weakRes.status}`);
    }
    console.log('  ✅ 400 Bad Request: Form validation rejected password shorter than 6 characters');

    // -------------------------------------------------------------
    // Test 4: Successful Login
    // -------------------------------------------------------------
    console.log('\n[4] Testing POST /api/auth/login with valid credentials...');
    const loginRes = await fetch(`${baseUrl}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testUser.email,
        password: testUser.password,
      }),
    });
    const loginData = await loginRes.json();

    if (loginRes.status !== 200 || !loginData.success) {
      throw new Error(`Login failed: ${JSON.stringify(loginData)}`);
    }
    if (loginData.data.user.password) {
      throw new Error('Security flaw: login response leaked password hash!');
    }
    console.log('  ✅ 200 OK: User logged in successfully and received auth cookie');

    // -------------------------------------------------------------
    // Test 5: Reject Invalid Password
    // -------------------------------------------------------------
    console.log('\n[5] Testing POST /api/auth/login with invalid password...');
    const badLoginRes = await fetch(`${baseUrl}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testUser.email,
        password: 'WrongPassword!',
      }),
    });
    const badLoginData = await badLoginRes.json();

    if (badLoginRes.status !== 401 || badLoginData.success) {
      throw new Error(`Invalid password should return 401 Unauthorized. Got: ${badLoginRes.status}`);
    }
    console.log('  ✅ 401 Unauthorized: Correctly rejected invalid password');

    // -------------------------------------------------------------
    // Test 6: Protected GET /api/auth/me with Cookie
    // -------------------------------------------------------------
    console.log('\n[6] Testing protected GET /api/auth/me with auth cookie...');
    const meRes = await fetch(`${baseUrl}/me`, {
      method: 'GET',
      headers: {
        Cookie: authCookie,
      },
    });
    const meData = await meRes.json();

    if (meRes.status !== 200 || !meData.success) {
      throw new Error(`GET /me failed: ${JSON.stringify(meData)}`);
    }
    if (meData.data.user.email !== testUser.email) {
      throw new Error('GET /me returned unexpected user profile data');
    }
    console.log(`  ✅ 200 OK: Successfully retrieved authenticated user profile: ${meData.data.user.email}`);

    // -------------------------------------------------------------
    // Test 7: Protected GET /api/auth/me without Cookie (Unauthorized)
    // -------------------------------------------------------------
    console.log('\n[7] Testing protected GET /api/auth/me without cookie...');
    const noAuthRes = await fetch(`${baseUrl}/me`, {
      method: 'GET',
    });
    const noAuthData = await noAuthRes.json();

    if (noAuthRes.status !== 401 || noAuthData.success) {
      throw new Error(`Unauthenticated GET /me should return 401. Got: ${noAuthRes.status}`);
    }
    console.log('  ✅ 401 Unauthorized: Route guard successfully blocked unauthenticated request');

    // -------------------------------------------------------------
    // Test 8: Logout clearing cookie
    // -------------------------------------------------------------
    console.log('\n[8] Testing POST /api/auth/logout...');
    const logoutRes = await fetch(`${baseUrl}/logout`, {
      method: 'POST',
    });
    const logoutData = await logoutRes.json();

    if (logoutRes.status !== 200 || !logoutData.success) {
      throw new Error(`Logout failed: ${JSON.stringify(logoutData)}`);
    }
    const logoutCookie = logoutRes.headers.get('set-cookie');
    if (!logoutCookie || !logoutCookie.includes('token=;')) {
      throw new Error('Logout did not clear auth cookie');
    }
    console.log('  ✅ 200 OK: Logged out and cleared HTTP-only auth cookie');

    // Clean up test user
    await User.deleteOne({ email: testUser.email });
    console.log('\n🧹 Test user cleaned up from database');
    console.log('🎉 8/8 Full Auth API Integration Tests Passed Successfully!\n');
  } finally {
    testServer.close();
    await mongoose.connection.close();
  }
};

runAuthIntegrationTests().catch((err) => {
  console.error('❌ Integration Test Failure:', err.message);
  process.exit(1);
});
