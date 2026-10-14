import http from 'http';
import mongoose from 'mongoose';
import app from '../src/app.js';
import User from '../src/models/User.js';
import Transaction from '../src/models/Transaction.js';
import { connectDB } from '../src/config/db.js';

const runE2EJourneyTest = async () => {
  console.log('🚀 Starting Phase 8: End-to-End Complete User Journey Automated Test Suite...\n');

  await connectDB();

  const testServer = http.createServer(app);
  await new Promise((resolve) => testServer.listen(0, resolve));
  const port = testServer.address().port;
  const baseUrl = `http://localhost:${port}/api`;

  const timestamp = Date.now();
  const testUserEmail = `e2e_journey_${timestamp}@spendwise.test`;
  const testPassword = 'StrongPassword123!';
  let authToken = '';
  let userId = '';

  let incomeTxId = '';
  let rentTxId = '';
  let groceryTxId = '';
  let utilityTxId = '';

  try {
    // -------------------------------------------------------------------------
    // STEP 1: Register User
    // -------------------------------------------------------------------------
    console.log('[Step 1] Registering a new personal expense tracker user...');
    const registerRes = await fetch(`${baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'E2E Pioneer Tester',
        email: testUserEmail,
        password: testPassword,
        currency: 'ETB',
      }),
    });

    if (registerRes.status !== 201) {
      throw new Error(`Step 1 Failed: Expected 201 Created but got ${registerRes.status}`);
    }
    const registerData = await registerRes.json();
    if (!registerData.success || !registerData.data?.token || !registerData.data?.user) {
      throw new Error('Step 1 Failed: Response missing success flag, token, or user object');
    }
    if (registerData.data.user.password || registerData.data.user.passwordHash) {
      throw new Error('Step 1 Security Failure: Password or passwordHash exposed in response');
    }

    userId = registerData.data.user._id || registerData.data.user.id;
    console.log(`  ✓ Registration successful (User ID: ${userId}, Email: ${testUserEmail})`);

    // -------------------------------------------------------------------------
    // STEP 2: Log in
    // -------------------------------------------------------------------------
    console.log('[Step 2] Authenticating via Login API...');
    const loginRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testUserEmail,
        password: testPassword,
      }),
    });

    if (loginRes.status !== 200) {
      throw new Error(`Step 2 Failed: Expected 200 OK but got ${loginRes.status}`);
    }
    const loginData = await loginRes.json();
    authToken = loginData.data?.token;
    if (!authToken) {
      throw new Error('Step 2 Failed: No JWT returned on login');
    }
    console.log('  ✓ Login successful, JWT session token acquired');

    const authHeaders = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`,
    };

    // -------------------------------------------------------------------------
    // STEP 3: Create Income Transaction
    // -------------------------------------------------------------------------
    console.log('[Step 3] Creating primary income transaction...');
    const incomeRes = await fetch(`${baseUrl}/transactions`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        type: 'income',
        amount: 50000,
        category: 'Salary',
        description: 'Monthly Senior Engineering Retainer',
        date: new Date().toISOString(),
        paymentMethod: 'bank_transfer',
      }),
    });

    if (incomeRes.status !== 201) {
      const errBody = await incomeRes.text();
      throw new Error(`Step 3 Failed: Expected 201 Created but got ${incomeRes.status}: ${errBody}`);
    }
    const incomeData = await incomeRes.json();
    incomeTxId = incomeData.data.transaction.id || incomeData.data.transaction._id;
    console.log(`  ✓ Income created: +50,000 ETB (ID: ${incomeTxId})`);

    // -------------------------------------------------------------------------
    // STEP 4: Create Multiple Expenses
    // -------------------------------------------------------------------------
    console.log('[Step 4] Creating multiple expense transactions across categories...');

    // Expense A: Housing & Rent (4,500)
    const rentRes = await fetch(`${baseUrl}/transactions`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        type: 'expense',
        amount: 4500,
        category: 'Housing & Rent',
        description: 'Modern workspace studio rent',
        date: new Date().toISOString(),
        paymentMethod: 'bank_transfer',
      }),
    });
    const rentData = await rentRes.json();
    rentTxId = rentData.data.transaction.id || rentData.data.transaction._id;

    // Expense B: Food & Dining (1,250)
    const groceryRes = await fetch(`${baseUrl}/transactions`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        type: 'expense',
        amount: 1250,
        category: 'Food & Dining',
        description: 'Weekly organic wholefood market groceries',
        date: new Date().toISOString(),
        paymentMethod: 'credit_card',
      }),
    });
    const groceryData = await groceryRes.json();
    groceryTxId = groceryData.data.transaction.id || groceryData.data.transaction._id;

    // Expense C: Utilities (850)
    const utilRes = await fetch(`${baseUrl}/transactions`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        type: 'expense',
        amount: 850,
        category: 'Utilities',
        description: 'Gigabit fiber optic internet service',
        date: new Date().toISOString(),
        paymentMethod: 'cash',
      }),
    });
    const utilData = await utilRes.json();
    utilityTxId = utilData.data.transaction.id || utilData.data.transaction._id;

    console.log(`  ✓ 3 Expenses recorded (Housing & Rent: 4,500, Food & Dining: 1,250, Utilities: 850)`);

    // -------------------------------------------------------------------------
    // STEP 5: Review Dashboard Totals
    // -------------------------------------------------------------------------
    console.log('[Step 5] Querying Dashboard summary and aggregate calculations...');
    const summaryRes = await fetch(`${baseUrl}/dashboard/summary`, {
      headers: authHeaders,
    });
    if (summaryRes.status !== 200) {
      throw new Error(`Step 5 Failed: Expected 200 OK from /dashboard/summary but got ${summaryRes.status}`);
    }
    const summaryData = await summaryRes.json();
    const stats = summaryData.data?.summary || summaryData.data;

    // Calculations:
    // Income: 50,000
    // Expenses: 4500 + 1250 + 850 = 6600
    // Net Balance: 50000 - 6600 = 43400
    if (stats.totalIncome !== 50000) {
      throw new Error(`Step 5 Math Error: Expected totalIncome 50000, got ${stats.totalIncome}`);
    }
    if (stats.totalExpenses !== 6600) {
      throw new Error(`Step 5 Math Error: Expected totalExpenses 6600, got ${stats.totalExpenses}`);
    }
    if (stats.netBalance !== 43400) {
      throw new Error(`Step 5 Math Error: Expected netBalance 43400, got ${stats.netBalance}`);
    }
    if (stats.transactionCount !== 4) {
      throw new Error(`Step 5 Math Error: Expected transactionCount 4, got ${stats.transactionCount}`);
    }
    console.log(`  ✓ Dashboard totals verified: Income: 50,000 | Expenses: 6,600 | Net: 43,400 (4 records)`);

    // -------------------------------------------------------------------------
    // STEP 6: Search and Filter Transactions
    // -------------------------------------------------------------------------
    console.log('[Step 6] Exercising multi-dimensional search & filtering API...');

    // 6.1 Search keyword "organic"
    const searchRes = await fetch(`${baseUrl}/transactions?search=organic`, {
      headers: authHeaders,
    });
    const searchJson = await searchRes.json();
    const totalMatchCount = searchJson.pagination?.totalCount ?? searchJson.count ?? searchJson.data?.transactions?.length;
    if (totalMatchCount !== 1) {
      throw new Error(`Step 6 Failed: Search for 'organic' expected 1 match, found ${totalMatchCount}`);
    }
    if (!searchJson.data.transactions[0].description.includes('organic')) {
      throw new Error(`Step 6 Failed: Returned item description did not contain 'organic'`);
    }

    // 6.2 Filter by category "Housing & Rent"
    const housingRes = await fetch(`${baseUrl}/transactions?category=${encodeURIComponent('Housing & Rent')}`, {
      headers: authHeaders,
    });
    const housingJson = await housingRes.json();
    if (housingJson.data.transactions.length !== 1 || housingJson.data.transactions[0].amount !== 4500) {
      throw new Error(`Step 6 Failed: Category filter 'Housing & Rent' failed`);
    }

    // 6.3 Sort by amount descending
    const sortRes = await fetch(`${baseUrl}/transactions?sortBy=amount&sortOrder=desc`, {
      headers: authHeaders,
    });
    const sortJson = await sortRes.json();
    if (sortJson.data.transactions[0].amount !== 50000) {
      throw new Error(`Step 6 Failed: Top transaction by descending amount should be 50,000`);
    }
    console.log('  ✓ Search query, category filter, and descending amount sort verified successfully');

    // -------------------------------------------------------------------------
    // STEP 7: Edit a Transaction
    // -------------------------------------------------------------------------
    console.log('[Step 7] Editing an existing transaction...');
    // Update Food expense from 1,250 to 1,500
    const editRes = await fetch(`${baseUrl}/transactions/${groceryTxId}`, {
      method: 'PATCH',
      headers: authHeaders,
      body: JSON.stringify({
        amount: 1500,
        description: 'Weekly organic wholefood market groceries and artisan bakery',
      }),
    });
    if (editRes.status !== 200) {
      throw new Error(`Step 7 Failed: Expected 200 OK from PATCH transaction, got ${editRes.status}`);
    }

    // Verify dashboard reflects update:
    // Total expenses should now be: 4500 + 1500 + 850 = 6850
    // Net balance: 50000 - 6850 = 43150
    const updatedSummaryRes = await fetch(`${baseUrl}/dashboard/summary`, {
      headers: authHeaders,
    });
    const updatedSummary = (await updatedSummaryRes.json()).data?.summary;
    if (updatedSummary.totalExpenses !== 6850 || updatedSummary.netBalance !== 43150) {
      throw new Error(`Step 7 Failed: Dashboard did not reflect updated transaction amount`);
    }
    console.log('  ✓ Transaction edited: Amount revised to 1,500; Dashboard updated automatically');

    // -------------------------------------------------------------------------
    // STEP 8: Delete a Transaction
    // -------------------------------------------------------------------------
    console.log('[Step 8] Deleting a transaction...');
    const deleteRes = await fetch(`${baseUrl}/transactions/${utilityTxId}`, {
      method: 'DELETE',
      headers: authHeaders,
    });
    if (deleteRes.status !== 200) {
      throw new Error(`Step 8 Failed: Expected 200 OK from DELETE transaction, got ${deleteRes.status}`);
    }

    // Verify dashboard reflects deletion:
    // Remaining expenses: 4500 + 1500 = 6000
    // Net balance: 50000 - 6000 = 44000
    // Transaction count: 3
    const postDeleteSummaryRes = await fetch(`${baseUrl}/dashboard/summary`, {
      headers: authHeaders,
    });
    const postDeleteSummary = (await postDeleteSummaryRes.json()).data?.summary;
    if (postDeleteSummary.totalExpenses !== 6000 || postDeleteSummary.netBalance !== 44000) {
      throw new Error(`Step 8 Failed: Dashboard did not reflect deleted transaction`);
    }
    if (postDeleteSummary.transactionCount !== 3) {
      throw new Error(`Step 8 Failed: Transaction count should be 3 after deletion`);
    }
    console.log('  ✓ Transaction deleted: Removed Utilities (850); Dashboard recalculation confirmed');

    // -------------------------------------------------------------------------
    // STEP 9: Update Profile Preferences
    // -------------------------------------------------------------------------
    console.log('[Step 9] Updating profile display name and currency preference...');
    const profileUpdateRes = await fetch(`${baseUrl}/users/me`, {
      method: 'PATCH',
      headers: authHeaders,
      body: JSON.stringify({
        name: 'E2E Lead Auditor',
        currency: 'USD',
      }),
    });
    if (profileUpdateRes.status !== 200) {
      throw new Error(`Step 9 Failed: Expected 200 OK from PATCH /users/me, got ${profileUpdateRes.status}`);
    }

    // Verify GET /auth/me returns updated details
    const meRes = await fetch(`${baseUrl}/auth/me`, {
      headers: authHeaders,
    });
    const meData = (await meRes.json()).data;
    if (meData.user.name !== 'E2E Lead Auditor' || meData.user.currency !== 'USD') {
      throw new Error(`Step 9 Failed: Profile changes did not persist to /auth/me`);
    }
    console.log('  ✓ Profile updated: Name -> "E2E Lead Auditor", Currency -> "USD"');

    // -------------------------------------------------------------------------
    // STEP 10: Log Out and Log Back In
    // -------------------------------------------------------------------------
    console.log('[Step 10] Performing session logout and subsequent re-authentication...');
    const logoutRes = await fetch(`${baseUrl}/auth/logout`, {
      method: 'POST',
      headers: authHeaders,
    });
    if (logoutRes.status !== 200) {
      throw new Error(`Step 10 Failed: Expected 200 OK on logout, got ${logoutRes.status}`);
    }

    // Re-login
    const reLoginRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testUserEmail,
        password: testPassword,
      }),
    });
    if (reLoginRes.status !== 200) {
      throw new Error(`Step 10 Failed: Re-login failed with status ${reLoginRes.status}`);
    }
    const reLoginData = await reLoginRes.json();
    const newSessionToken = reLoginData.data?.token;
    if (!newSessionToken) {
      throw new Error('Step 10 Failed: Fresh token not received upon re-login');
    }
    console.log('  ✓ Logout completed and re-authentication verified with new token');

    // -------------------------------------------------------------------------
    // STEP 11: Confirm Data Persistence Across Sessions
    // -------------------------------------------------------------------------
    console.log('[Step 11] Confirming full financial data persistence across sessions...');
    const persistentTxRes = await fetch(`${baseUrl}/transactions`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${newSessionToken}`,
      },
    });
    const persistentTxData = await persistentTxRes.json();
    const records = persistentTxData.data?.transactions || [];

    if (records.length !== 3) {
      throw new Error(`Step 11 Failed: Expected 3 persisted transactions, found ${records.length}`);
    }
    const amounts = records.map((t) => t.amount).sort((a, b) => b - a);
    if (amounts[0] !== 50000 || amounts[1] !== 4500 || amounts[2] !== 1500) {
      throw new Error(`Step 11 Failed: Persisted transaction amounts mismatch: ${JSON.stringify(amounts)}`);
    }
    console.log(`  ✓ Data persistence verified: 3 transactions intact [${amounts.join(', ')}] across authentication cycles`);

    console.log('\n======================================================');
    console.log('🎉 ALL 11 STEPS OF THE END-TO-END USER JOURNEY PASSED!');
    console.log('======================================================\n');
  } catch (error) {
    console.error('❌ E2E Journey Test Failed:', error);
    process.exitCode = 1;
  } finally {
    // Graceful teardown of test user & associated records
    try {
      if (userId) {
        await Transaction.deleteMany({ user: userId });
        await User.findByIdAndDelete(userId);
      }
    } catch (cleanupErr) {
      console.warn('Cleanup warning:', cleanupErr.message);
    }

    if (testServer.closeAllConnections) {
      testServer.closeAllConnections();
    }
    await new Promise((resolve) => testServer.close(resolve));
    await mongoose.connection.close();
    process.exit(process.exitCode || 0);
  }
};

runE2EJourneyTest();
