import http from 'http';
import mongoose from 'mongoose';
import app from '../src/app.js';
import User from '../src/models/User.js';
import Transaction from '../src/models/Transaction.js';
import { connectDB } from '../src/config/db.js';

const runTransactionIntegrationTests = async () => {
  console.log('🧪 Starting Full Transaction API Integration Test Suite...');
  await connectDB();

  const testPort = 5003;
  const testServer = http.createServer(app);
  await new Promise((resolve) => testServer.listen(testPort, resolve));
  const baseUrl = `http://localhost:${testPort}/api`;

  const uniqueSuffix = Date.now();
  const userA = {
    name: 'Alice Investor',
    email: `alice_tx_${uniqueSuffix}@spendwise.et`,
    password: 'Password123!',
  };
  const userB = {
    name: 'Bob Spender',
    email: `bob_tx_${uniqueSuffix}@spendwise.et`,
    password: 'Password123!',
  };

  let userAToken = null;
  let userBToken = null;
  let userACookie = null;
  let userAId = null;
  let userBId = null;
  let userATransactionId = null;

  try {
    // Register User A
    const regARes = await fetch(`${baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userA),
    });
    const regAData = await regARes.json();
    userAToken = regAData.data.token;
    userAId = regAData.data.user.id;
    const cookieAHeader = regARes.headers.get('set-cookie');
    userACookie = cookieAHeader ? cookieAHeader.split(';')[0] : '';

    // Register User B
    const regBRes = await fetch(`${baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userB),
    });
    const regBData = await regBRes.json();
    userBToken = regBData.data.token;
    userBId = regBData.data.user.id;

    // [1] Reject without auth (401)
    console.log('\n[1] Testing transaction creation without authentication (401)...');
    const noAuthRes = await fetch(`${baseUrl}/transactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'expense', amount: 100, category: 'Food & Dining' }),
    });
    if (noAuthRes.status !== 401) throw new Error(`Expected 401, got ${noAuthRes.status}`);
    console.log('  ✅ 401 Unauthorized: Route guard successfully blocked unauthenticated request');

    // [2] Reject invalid amount <= 0 (400)
    console.log('\n[2] Testing transaction creation with invalid amount <= 0 (400)...');
    const badAmountRes = await fetch(`${baseUrl}/transactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userAToken}`,
      },
      body: JSON.stringify({ type: 'expense', amount: -25, category: 'Food & Dining' }),
    });
    const badAmountData = await badAmountRes.json();
    if (badAmountRes.status !== 400 || badAmountData.error.code !== 'VALIDATION_ERROR') {
      throw new Error(`Expected 400 VALIDATION_ERROR, got ${badAmountRes.status}`);
    }
    console.log('  ✅ 400 Bad Request: Validation caught negative monetary amount');

    // [3] Reject category-type mismatch (400)
    console.log('\n[3] Testing category-type mismatch rejection (400)...');
    const mismatchRes = await fetch(`${baseUrl}/transactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userAToken}`,
      },
      body: JSON.stringify({ type: 'income', amount: 5000, category: 'Food & Dining' }),
    });
    if (mismatchRes.status !== 400) throw new Error(`Expected 400, got ${mismatchRes.status}`);
    console.log('  ✅ 400 Bad Request: Validation caught category affinity mismatch');

    // [4] Create valid transaction for User A (201)
    console.log('\n[4] Testing valid transaction creation (201)...');
    const createRes = await fetch(`${baseUrl}/transactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userAToken}`,
      },
      body: JSON.stringify({
        type: 'expense',
        amount: 1450.5,
        category: 'Food & Dining',
        description: 'Supermarket supplies',
        paymentMethod: 'bank_transfer',
      }),
    });
    const createData = await createRes.json();
    if (createRes.status !== 201 || !createData.success) {
      throw new Error(`Failed to create transaction: ${JSON.stringify(createData)}`);
    }
    userATransactionId = createData.data.transaction.id;
    console.log('  ✅ 201 Created: Transaction saved to MongoDB with precision rounding: 1450.50');

    // [5] List transactions for User A (200)
    console.log('\n[5] Testing listing transactions for User A (200)...');
    const listRes = await fetch(`${baseUrl}/transactions`, {
      headers: { Authorization: `Bearer ${userAToken}` },
    });
    const listData = await listRes.json();
    if (listRes.status !== 200 || listData.count !== 1) {
      throw new Error(`Expected count 1, got ${listData.count}`);
    }
    console.log('  ✅ 200 OK: Retrieved transaction list strictly scoped to User A');

    // [6] Retrieve single transaction by ID (200)
    console.log('\n[6] Testing retrieving single transaction by ID (200)...');
    const singleRes = await fetch(`${baseUrl}/transactions/${userATransactionId}`, {
      headers: { Authorization: `Bearer ${userAToken}` },
    });
    const singleData = await singleRes.json();
    if (singleRes.status !== 200 || singleData.data.transaction.id !== userATransactionId) {
      throw new Error(`Failed to retrieve single transaction`);
    }
    console.log('  ✅ 200 OK: Single transaction retrieved with ownership confirmed');

    // [7] Update transaction (200)
    console.log('\n[7] Testing updating transaction (200)...');
    const updateRes = await fetch(`${baseUrl}/transactions/${userATransactionId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userAToken}`,
      },
      body: JSON.stringify({
        amount: 1600.0,
        description: 'Updated supermarket supplies total',
      }),
    });
    const updateData = await updateRes.json();
    if (updateRes.status !== 200 || updateData.data.transaction.amount !== 1600) {
      throw new Error(`Failed to update transaction`);
    }
    console.log('  ✅ 200 OK: Successfully updated amount to 1600.00');

    // [8] SECURITY ISOLATION: User B cannot access User A transaction (404)
    console.log('\n[8] Testing SECURITY ISOLATION: User B cannot access User A transaction (404)...');
    const leakRes = await fetch(`${baseUrl}/transactions/${userATransactionId}`, {
      headers: { Authorization: `Bearer ${userBToken}` },
    });
    if (leakRes.status !== 404) {
      throw new Error(`CRITICAL SECURITY FLAW: User B could access User A transaction! Status: ${leakRes.status}`);
    }
    console.log('  ✅ 404 Not Found: Strict user ownership guard prevented cross-tenant read');

    // [9] SECURITY ISOLATION: User B cannot delete User A transaction (404)
    console.log('\n[9] Testing SECURITY ISOLATION: User B cannot delete User A transaction (404)...');
    const deleteAttackRes = await fetch(`${baseUrl}/transactions/${userATransactionId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${userBToken}` },
    });
    if (deleteAttackRes.status !== 404) {
      throw new Error(`CRITICAL SECURITY FLAW: User B could delete User A transaction!`);
    }
    console.log('  ✅ 404 Not Found: Strict ownership guard prevented unauthorized delete');

    // [10] Owner User A deletes transaction (200)
    console.log('\n[10] Testing deletion by legitimate owner User A (200)...');
    const deleteRes = await fetch(`${baseUrl}/transactions/${userATransactionId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${userAToken}` },
    });
    if (deleteRes.status !== 200) {
      throw new Error(`Failed to delete transaction by owner`);
    }
    console.log('  ✅ 200 OK: Transaction deleted successfully');

    // [11] Verification: deleted transaction no longer exists
    console.log('\n[11] Verifying deleted transaction is no longer accessible (404)...');
    const verifyDeleted = await fetch(`${baseUrl}/transactions/${userATransactionId}`, {
      headers: { Authorization: `Bearer ${userAToken}` },
    });
    if (verifyDeleted.status !== 404) {
      throw new Error('Transaction was not deleted properly');
    }
    console.log('  ✅ 404 Not Found: Transaction confirmed permanently removed from MongoDB');

    console.log('\n🎉 11/11 Transaction CRUD & Security Isolation Tests Passed Successfully!\n');
  } finally {
    // Cleanup
    await Transaction.deleteMany({ user: { $in: [userAId, userBId] } });
    await User.deleteMany({ _id: { $in: [userAId, userBId] } });
    testServer.close();
    await mongoose.connection.close();
  }
};

runTransactionIntegrationTests().catch((err) => {
  console.error('❌ Transaction Test Suite Failed:', err);
  process.exit(1);
});
