import http from 'http';
import mongoose from 'mongoose';
import app from '../src/app.js';
import User from '../src/models/User.js';
import { connectDB } from '../src/config/db.js';

const runProfileCurrencyTests = async () => {
  console.log('🧪 Starting Full Phase 6: User Profile & Currency Preferences Test Suite...\n');

  await connectDB();

  const testServer = http.createServer(app);
  await new Promise((resolve) => testServer.listen(0, resolve));
  const port = testServer.address().port;
  const baseUrl = `http://localhost:${port}/api`;

  const timestamp = Date.now();
  let userAToken = '';
  let userBToken = '';
  let userAId = '';
  let userBId = '';

  try {
    // 1. Setup User A and User B
    const userARes = await fetch(`${baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Profile Tester A',
        email: `profile_a_${timestamp}@example.com`,
        password: 'Password123!',
      }),
    });
    const userAData = await userARes.json();
    userAToken = userAData.data.token;
    userAId = userAData.data.user._id || userAData.data.user.id;

    const userBRes = await fetch(`${baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Profile Tester B',
        email: `profile_b_${timestamp}@example.com`,
        password: 'Password123!',
      }),
    });
    const userBData = await userBRes.json();
    userBToken = userBData.data.token;
    userBId = userBData.data.user._id || userBData.data.user.id;

    // Test 1: Unauthenticated GET /api/users/me (401)
    console.log('[1] Testing unauthenticated GET /api/users/me (401)...');
    const unauthGetRes = await fetch(`${baseUrl}/users/me`);
    if (unauthGetRes.status !== 401) {
      throw new Error(`Expected 401 for unauthenticated profile GET, got ${unauthGetRes.status}`);
    }
    console.log('  ✅ 401 Unauthorized: Route guard successfully blocked unauthenticated request\n');

    // Test 2: Authenticated GET /api/users/me (200)
    console.log('[2] Testing authenticated GET /api/users/me (200)...');
    const authGetRes = await fetch(`${baseUrl}/users/me`, {
      headers: { Authorization: `Bearer ${userAToken}` },
    });
    if (authGetRes.status !== 200) {
      throw new Error(`Expected 200 for authenticated profile GET, got ${authGetRes.status}`);
    }
    const authGetData = await authGetRes.json();
    if (
      !authGetData.data.user ||
      authGetData.data.user.email !== `profile_a_${timestamp}@example.com` ||
      authGetData.data.user.currency !== 'ETB' ||
      authGetData.data.user.password
    ) {
      throw new Error('Profile payload mismatch or leaked password field');
    }
    console.log('  ✅ 200 OK: Retrieved authenticated user profile with default currency ETB and no password leakage\n');

    // Test 3: Unauthenticated PATCH /api/users/me (401)
    console.log('[3] Testing unauthenticated PATCH /api/users/me (401)...');
    const unauthPatchRes = await fetch(`${baseUrl}/users/me`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Hacker' }),
    });
    if (unauthPatchRes.status !== 401) {
      throw new Error(`Expected 401 for unauthenticated PATCH, got ${unauthPatchRes.status}`);
    }
    console.log('  ✅ 401 Unauthorized: Blocked unauthenticated PATCH request\n');

    // Test 4: PATCH /api/users/me with empty body (400)
    console.log('[4] Testing PATCH /api/users/me with empty payload (400)...');
    const emptyPatchRes = await fetch(`${baseUrl}/users/me`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userAToken}`,
      },
      body: JSON.stringify({}),
    });
    if (emptyPatchRes.status !== 400) {
      throw new Error(`Expected 400 for empty update payload, got ${emptyPatchRes.status}`);
    }
    console.log('  ✅ 400 Bad Request: Correctly rejected empty update payload\n');

    // Test 5: PATCH /api/users/me updating name only (200)
    console.log('[5] Testing PATCH /api/users/me updating display name (200)...');
    const updateNameRes = await fetch(`${baseUrl}/users/me`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userAToken}`,
      },
      body: JSON.stringify({ name: 'Alexander Hamilton' }),
    });
    if (updateNameRes.status !== 200) {
      throw new Error(`Expected 200 for name update, got ${updateNameRes.status}`);
    }
    const updateNameData = await updateNameRes.json();
    if (updateNameData.data.user.name !== 'Alexander Hamilton') {
      throw new Error(`Expected name to be "Alexander Hamilton", got "${updateNameData.data.user.name}"`);
    }
    console.log('  ✅ 200 OK: Display name updated to "Alexander Hamilton"\n');

    // Test 6: PATCH /api/users/me updating currency preference to USD (200)
    console.log('[6] Testing PATCH /api/users/me updating preferred currency to USD (200)...');
    const updateCurrencyRes = await fetch(`${baseUrl}/users/me`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userAToken}`,
      },
      body: JSON.stringify({ currency: 'USD' }),
    });
    if (updateCurrencyRes.status !== 200) {
      throw new Error(`Expected 200 for currency update, got ${updateCurrencyRes.status}`);
    }
    const updateCurrencyData = await updateCurrencyRes.json();
    if (updateCurrencyData.data.user.currency !== 'USD') {
      throw new Error(`Expected currency to be "USD", got "${updateCurrencyData.data.user.currency}"`);
    }
    console.log('  ✅ 200 OK: Currency updated to "USD"\n');

    // Test 7: Verify persistence with GET /api/users/me (200)
    console.log('[7] Testing persistence of updated fields on subsequent GET /api/users/me...');
    const verifyGetRes = await fetch(`${baseUrl}/users/me`, {
      headers: { Authorization: `Bearer ${userAToken}` },
    });
    const verifyGetData = await verifyGetRes.json();
    if (
      verifyGetData.data.user.name !== 'Alexander Hamilton' ||
      verifyGetData.data.user.currency !== 'USD'
    ) {
      throw new Error('Persisted fields in database do not match updated values');
    }
    console.log('  ✅ 200 OK: Verified database persistence (Name: "Alexander Hamilton", Currency: "USD")\n');

    // Test 8: PATCH /api/users/me with unsupported currency code (400)
    console.log('[8] Testing rejection of unsupported currency code (?currency=BITCOIN)...');
    const badCurrencyRes = await fetch(`${baseUrl}/users/me`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userAToken}`,
      },
      body: JSON.stringify({ currency: 'BITCOIN' }),
    });
    if (badCurrencyRes.status !== 400) {
      throw new Error(`Expected 400 for unsupported currency, got ${badCurrencyRes.status}`);
    }
    console.log('  ✅ 400 Bad Request: Validation intercepted unsupported currency code\n');

    // Test 9: PATCH /api/users/me with name too short (400)
    console.log('[9] Testing rejection of name under 2 characters...');
    const shortNameRes = await fetch(`${baseUrl}/users/me`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userAToken}`,
      },
      body: JSON.stringify({ name: 'A' }),
    });
    if (shortNameRes.status !== 400) {
      throw new Error(`Expected 400 for short name, got ${shortNameRes.status}`);
    }
    console.log('  ✅ 400 Bad Request: Validation intercepted name length violation\n');

    // Test 10: PATCH /api/users/me attempting to mutate protected field "email" (400)
    console.log('[10] Testing security guard preventing mutation of protected field "email"...');
    const protectedEmailRes = await fetch(`${baseUrl}/users/me`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userAToken}`,
      },
      body: JSON.stringify({ email: 'newemail@example.com' }),
    });
    if (protectedEmailRes.status !== 400) {
      throw new Error(`Expected 400 for protected email mutation attempt, got ${protectedEmailRes.status}`);
    }
    console.log('  ✅ 400 Bad Request: Protected field guard intercepted email mutation attempt\n');

    // Test 11: PATCH /api/users/me attempting to inject "password" or "role" (400)
    console.log('[11] Testing security guard preventing mutation of "password" via profile PATCH...');
    const protectedPassRes = await fetch(`${baseUrl}/users/me`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userAToken}`,
      },
      body: JSON.stringify({ password: 'InjectedPassword123!' }),
    });
    if (protectedPassRes.status !== 400) {
      throw new Error(`Expected 400 for password mutation via profile, got ${protectedPassRes.status}`);
    }
    console.log('  ✅ 400 Bad Request: Protected field guard intercepted password injection attempt\n');

    // Test 12: Revert currency back to default ETB (200)
    console.log('[12] Testing reverting currency preference back to ETB...');
    const revertRes = await fetch(`${baseUrl}/users/me`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userAToken}`,
      },
      body: JSON.stringify({ currency: 'ETB' }),
    });
    if (revertRes.status !== 200) {
      throw new Error(`Expected 200 for currency revert, got ${revertRes.status}`);
    }
    const revertData = await revertRes.json();
    if (revertData.data.user.currency !== 'ETB') {
      throw new Error(`Expected currency to be ETB, got ${revertData.data.user.currency}`);
    }
    console.log('  ✅ 200 OK: Currency restored to default ETB\n');

    // Test 13: Multi-tenant isolation between User A and User B
    console.log('[13] Testing multi-tenant profile isolation (User B profile remains intact)...');
    const userBCheckRes = await fetch(`${baseUrl}/users/me`, {
      headers: { Authorization: `Bearer ${userBToken}` },
    });
    const userBCheckData = await userBCheckRes.json();
    if (
      userBCheckData.data.user.name !== 'Profile Tester B' ||
      userBCheckData.data.user.currency !== 'ETB'
    ) {
      throw new Error('User B profile was inadvertently altered by User A mutations!');
    }
    console.log('  ✅ 200 OK: Multi-tenant boundary strictly preserved (User B name: "Profile Tester B", currency: "ETB")\n');

    console.log('🎉 13/13 User Profile & Currency Preference Tests Passed Successfully!\n');
  } finally {
    await new Promise((resolve) => testServer.close(resolve));
    await mongoose.connection.close();
  }
};

runProfileCurrencyTests().catch((err) => {
  console.error('❌ Phase 6 Test Failure:', err);
  process.exit(1);
});
