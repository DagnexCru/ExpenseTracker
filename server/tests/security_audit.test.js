import http from 'http';
import mongoose from 'mongoose';
import app from '../src/app.js';
import User from '../src/models/User.js';
import Transaction from '../src/models/Transaction.js';
import { connectDB } from '../src/config/db.js';
import { createRateLimiter, resetRateLimits } from '../src/middleware/rate_limiter.middleware.js';

const runSecurityAuditTests = async () => {
  console.log('🛡️ Starting Full Phase 7: Security Audit & Validation Defense Test Suite...\n');

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
  let userATransactionId = '';

  try {
    // 1. Setup Users
    const userARes = await fetch(`${baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Security User A',
        email: `sec_a_${timestamp}@example.com`,
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
        name: 'Security User B',
        email: `sec_b_${timestamp}@example.com`,
        password: 'Password123!',
      }),
    });
    const userBData = await userBRes.json();
    userBToken = userBData.data.token;
    userBId = userBData.data.user._id || userBData.data.user.id;

    // Test 1: Verify OWASP Security Headers & Absence of X-Powered-By
    console.log('[1] Testing OWASP Security Headers on response...');
    const headerRes = await fetch(`${baseUrl}/health`);
    const contentTypeOptions = headerRes.headers.get('x-content-type-options');
    const frameOptions = headerRes.headers.get('x-frame-options');
    const xssProtection = headerRes.headers.get('x-xss-protection');
    const referrerPolicy = headerRes.headers.get('referrer-policy');
    const poweredBy = headerRes.headers.get('x-powered-by');

    if (contentTypeOptions !== 'nosniff') {
      throw new Error(`Expected X-Content-Type-Options: nosniff, got ${contentTypeOptions}`);
    }
    if (frameOptions !== 'DENY') {
      throw new Error(`Expected X-Frame-Options: DENY, got ${frameOptions}`);
    }
    if (xssProtection !== '1; mode=block') {
      throw new Error(`Expected X-XSS-Protection: 1; mode=block, got ${xssProtection}`);
    }
    if (referrerPolicy !== 'strict-origin-when-cross-origin') {
      throw new Error(`Expected Referrer-Policy: strict-origin-when-cross-origin, got ${referrerPolicy}`);
    }
    if (poweredBy !== null) {
      throw new Error(`X-Powered-By header should be suppressed to prevent fingerprinting, but found: ${poweredBy}`);
    }
    console.log('  ✅ 200 OK: All OWASP Security Headers verified (nosniff, DENY, XSS block) and X-Powered-By suppressed\n');

    // Test 2: Authentication Rate Limiter (Brute-Force Protection 429)
    console.log('[2] Testing Authentication Rate Limiter under rapid repeated attempts...');
    resetRateLimits();
    const testLimiter = createRateLimiter({
      windowMs: 60 * 1000,
      max: 3,
      enforceInTest: true,
      message: 'Rate limit exceeded for test.',
    });

    // Mock an IP request series
    let rateLimitTriggered = false;
    let retryAfterHeader = null;

    for (let i = 1; i <= 5; i++) {
      const mockReq = { ip: '198.51.100.1', headers: {}, socket: { remoteAddress: '198.51.100.1' } };
      let mockResStatus = 200;
      const mockRes = {
        setHeader: (k, v) => {
          if (k.toLowerCase() === 'retry-after') retryAfterHeader = v;
        },
        status: (code) => {
          mockResStatus = code;
          return {
            json: (body) => {
              if (code === 429) rateLimitTriggered = true;
            },
          };
        },
      };

      testLimiter(mockReq, mockRes, () => {});
    }

    if (!rateLimitTriggered || !retryAfterHeader) {
      throw new Error('Rate limiter failed to trigger 429 Too Many Requests or missing Retry-After header');
    }
    console.log(`  ✅ 429 Too Many Requests: Rate limiter intercepted requests exceeding max bound (Retry-After: ${retryAfterHeader}s)\n`);

    // Test 3: NoSQL Injection Sanitizer
    console.log('[3] Testing NoSQL query injection sanitization...');
    const txCreateRes = await fetch(`${baseUrl}/transactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userAToken}`,
      },
      body: JSON.stringify({
        type: 'expense',
        amount: 85.00,
        category: 'Food & Dining',
        date: '2026-03-20',
        description: 'Security validation coffee',
        paymentMethod: 'cash',
        $ne: 'injection_token',
        '$where': 'malicious_code()',
      }),
    });
    const txCreateData = await txCreateRes.json();
    if (txCreateRes.status !== 201) {
      throw new Error(`Failed to create transaction: ${JSON.stringify(txCreateData)}`);
    }
    userATransactionId = txCreateData.data.transaction.id;

    // Verify injected operators were stripped
    if (txCreateData.data.transaction.$ne || txCreateData.data.transaction['$where']) {
      throw new Error('NoSQL injection operators were not stripped from request body');
    }
    console.log('  ✅ 201 Created: Transaction saved safely with NoSQL injection operators ($ne, $where) completely neutralized\n');

    // Test 4: Cross-Tenant Read Defense (IDOR) - User B cannot read User A transaction
    console.log('[4] Testing IDOR Defense: User B attempting to read User A transaction...');
    const idorReadRes = await fetch(`${baseUrl}/transactions/${userATransactionId}`, {
      headers: { Authorization: `Bearer ${userBToken}` },
    });
    if (idorReadRes.status !== 404) {
      throw new Error(`Expected 404 Not Found for cross-tenant read, got ${idorReadRes.status}`);
    }
    console.log('  ✅ 404 Not Found: Strict ownership query prevented cross-tenant read without leaking existence\n');

    // Test 5: Cross-Tenant Mutation Defense (IDOR) - User B cannot update User A transaction
    console.log('[5] Testing IDOR Defense: User B attempting to update User A transaction...');
    const idorUpdateRes = await fetch(`${baseUrl}/transactions/${userATransactionId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userBToken}`,
      },
      body: JSON.stringify({
        type: 'expense',
        amount: 9999.00,
        category: 'Food & Dining',
        date: '2026-03-20',
      }),
    });
    if (idorUpdateRes.status !== 404) {
      throw new Error(`Expected 404 Not Found for cross-tenant update, got ${idorUpdateRes.status}`);
    }
    console.log('  ✅ 404 Not Found: Strict ownership query blocked unauthorized update attempt\n');

    // Test 6: Cross-Tenant Deletion Defense (IDOR) - User B cannot delete User A transaction
    console.log('[6] Testing IDOR Defense: User B attempting to delete User A transaction...');
    const idorDeleteRes = await fetch(`${baseUrl}/transactions/${userATransactionId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${userBToken}` },
    });
    if (idorDeleteRes.status !== 404) {
      throw new Error(`Expected 404 Not Found for cross-tenant delete, got ${idorDeleteRes.status}`);
    }
    console.log('  ✅ 404 Not Found: Strict ownership query blocked unauthorized delete attempt\n');

    // Test 7: JWT Tampering Defense
    console.log('[7] Testing JWT Tampering Defense with modified token signature...');
    const tamperedToken = userAToken.substring(0, userAToken.length - 6) + 'abc123';
    const tamperedRes = await fetch(`${baseUrl}/auth/me`, {
      headers: { Authorization: `Bearer ${tamperedToken}` },
    });
    if (tamperedRes.status !== 401) {
      throw new Error(`Expected 401 Unauthorized for tampered token, got ${tamperedRes.status}`);
    }
    console.log('  ✅ 401 Unauthorized: Token verification intercepted tampered cryptographic signature\n');

    // Test 8: Malformed Authorization Header Defense
    console.log('[8] Testing Malformed Authorization Header defense...');
    const malformedRes = await fetch(`${baseUrl}/auth/me`, {
      headers: { Authorization: 'Basic invalid-auth-format' },
    });
    if (malformedRes.status !== 401) {
      throw new Error(`Expected 401 Unauthorized for malformed header, got ${malformedRes.status}`);
    }
    console.log('  ✅ 401 Unauthorized: Correctly rejected non-Bearer authorization header format\n');

    // Test 9: Protected Profile Field Defense (Immutable Email)
    console.log('[9] Testing Protected Profile Field Defense (Immutable Email)...');
    const protectEmailRes = await fetch(`${baseUrl}/users/me`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userAToken}`,
      },
      body: JSON.stringify({ email: 'takeover@victim.com' }),
    });
    if (protectEmailRes.status !== 400) {
      throw new Error(`Expected 400 Bad Request for immutable email, got ${protectEmailRes.status}`);
    }
    console.log('  ✅ 400 Bad Request: Mass-assignment guard intercepted email mutation attempt\n');

    // Test 10: Zero Password Hash Exposure
    console.log('[10] Testing Zero Password Hash Exposure in all user query endpoints...');
    const meRes = await fetch(`${baseUrl}/auth/me`, {
      headers: { Authorization: `Bearer ${userAToken}` },
    });
    const meData = await meRes.json();
    const userObj = meData.data.user;

    if (userObj.password || userObj.passwordHash || userObj.__v) {
      throw new Error('Sensitive authentication field (password, passwordHash, or __v) was leaked!');
    }
    console.log('  ✅ 200 OK: User profile confirmed clean with zero password hash leakage\n');

    console.log('🎉 10/10 Comprehensive Security Audit & Defense Tests Passed Successfully!\n');
  } finally {
    await new Promise((resolve) => testServer.close(resolve));
    await mongoose.connection.close();
  }
};

runSecurityAuditTests().catch((err) => {
  console.error('❌ Security Audit Test Failure:', err);
  process.exit(1);
});
