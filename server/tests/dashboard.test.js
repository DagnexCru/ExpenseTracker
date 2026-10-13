import http from 'http';
import mongoose from 'mongoose';
import app from '../src/app.js';
import User from '../src/models/User.js';
import Transaction from '../src/models/Transaction.js';
import { connectDB } from '../src/config/db.js';

const runDashboardIntegrationTests = async () => {
  console.log('🧪 Starting Full Dashboard API Integration & Aggregation Test Suite...\n');

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
        name: 'Dashboard Tester A',
        email: `dash_a_${timestamp}@example.com`,
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
        name: 'Dashboard Tester B',
        email: `dash_b_${timestamp}@example.com`,
        password: 'Password123!',
      }),
    });
    const userBData = await userBRes.json();
    userBToken = userBData.data.token;
    userBId = userBData.data.user._id || userBData.data.user.id;

    // [1] Unauthenticated request to /api/dashboard/summary (401)
    console.log('[1] Testing unauthenticated access to /api/dashboard/summary (401)...');
    const unauthRes = await fetch(`${baseUrl}/dashboard/summary`);
    if (unauthRes.status !== 401) {
      throw new Error(`Expected 401 Unauthorized, got ${unauthRes.status}`);
    }
    console.log('  ✅ 401 Unauthorized: Route guard blocked unauthenticated request');

    // [2] Empty state for User A before any transactions
    console.log('\n[2] Testing empty dashboard summary for new user (200)...');
    const emptySummaryRes = await fetch(`${baseUrl}/dashboard/summary`, {
      headers: { Authorization: `Bearer ${userAToken}` },
    });
    const emptySummary = await emptySummaryRes.json();
    if (
      emptySummary.status !== undefined && emptySummary.statusCode !== 200 &&
      emptySummary.data?.summary?.totalIncome !== 0
    ) {
      throw new Error(`Empty summary verification failed`);
    }
    if (
      emptySummary.data.summary.totalIncome !== 0 ||
      emptySummary.data.summary.totalExpenses !== 0 ||
      emptySummary.data.summary.netBalance !== 0 ||
      emptySummary.data.summary.hasData !== false
    ) {
      throw new Error(`Expected all zero metrics for empty user`);
    }
    console.log('  ✅ 200 OK: Empty summary returned zeros and hasData: false');

    // [3] Seed known financial transactions for User A
    console.log('\n[3] Seeding known financial transaction dataset for User A...');
    const transactionsToSeed = [
      {
        user: userAId,
        type: 'income',
        amount: 50000.0,
        category: 'Salary',
        description: 'Primary salary',
        date: new Date('2026-01-15T10:00:00Z'),
        paymentMethod: 'bank_transfer',
      },
      {
        user: userAId,
        type: 'income',
        amount: 15000.0,
        category: 'Freelance & Consulting',
        description: 'Consulting client project',
        date: new Date('2026-02-10T14:00:00Z'),
        paymentMethod: 'bank_transfer',
      },
      {
        user: userAId,
        type: 'expense',
        amount: 12000.0,
        category: 'Housing & Rent',
        description: 'Apartment rent',
        date: new Date('2026-01-20T09:00:00Z'),
        paymentMethod: 'bank_transfer',
      },
      {
        user: userAId,
        type: 'expense',
        amount: 4500.0,
        category: 'Food & Dining',
        description: 'Supermarket and groceries',
        date: new Date('2026-02-15T18:00:00Z'),
        paymentMethod: 'mobile_money',
      },
      {
        user: userAId,
        type: 'expense',
        amount: 2500.0,
        category: 'Utilities',
        description: 'Electricity and Internet',
        date: new Date('2026-02-22T11:00:00Z'),
        paymentMethod: 'mobile_money',
      },
    ];
    await Transaction.insertMany(transactionsToSeed);
    console.log('  ✅ Inserted 5 known transactions (Total Income: 65,000, Total Expenses: 19,000, Net: 46,000)');

    // [4] Test /api/dashboard/summary with seeded transactions
    console.log('\n[4] Testing /api/dashboard/summary calculations with seeded dataset...');
    const summaryRes = await fetch(`${baseUrl}/dashboard/summary`, {
      headers: { Authorization: `Bearer ${userAToken}` },
    });
    const summaryData = await summaryRes.json();
    if (summaryRes.status !== 200 || !summaryData.success) {
      throw new Error(`Failed to fetch summary: ${JSON.stringify(summaryData)}`);
    }

    const { summary, recentTransactions } = summaryData.data;
    if (summary.totalIncome !== 65000) {
      throw new Error(`Expected totalIncome 65000, got ${summary.totalIncome}`);
    }
    if (summary.totalExpenses !== 19000) {
      throw new Error(`Expected totalExpenses 19000, got ${summary.totalExpenses}`);
    }
    if (summary.netBalance !== 46000) {
      throw new Error(`Expected netBalance 46000, got ${summary.netBalance}`);
    }
    // Savings rate: ((65000 - 19000) / 65000) * 100 = 70.769... -> 70.8%
    if (summary.savingsRate !== 70.8) {
      throw new Error(`Expected savingsRate 70.8, got ${summary.savingsRate}`);
    }
    if (summary.transactionCount !== 5) {
      throw new Error(`Expected transactionCount 5, got ${summary.transactionCount}`);
    }
    if (recentTransactions.length !== 5) {
      throw new Error(`Expected 5 recent transactions, got ${recentTransactions.length}`);
    }
    console.log('  ✅ 200 OK: Summary accurately calculated Total Income (65,000), Expenses (19,000), Net (46,000), Savings Rate (70.8%)');

    // [5] Test /api/dashboard/monthly trend aggregation
    console.log('\n[5] Testing /api/dashboard/monthly aggregation pipeline...');
    const monthlyRes = await fetch(`${baseUrl}/dashboard/monthly?year=2026`, {
      headers: { Authorization: `Bearer ${userAToken}` },
    });
    const monthlyData = await monthlyRes.json();
    if (monthlyRes.status !== 200 || !monthlyData.success) {
      throw new Error(`Failed to fetch monthly data: ${JSON.stringify(monthlyData)}`);
    }

    const janSlot = monthlyData.data.monthly.find((m) => m.monthKey === '2026-01');
    const febSlot = monthlyData.data.monthly.find((m) => m.monthKey === '2026-02');

    if (!janSlot || janSlot.income !== 50000 || janSlot.expenses !== 12000 || janSlot.net !== 38000) {
      throw new Error(`Jan 2026 aggregation incorrect: ${JSON.stringify(janSlot)}`);
    }
    if (!febSlot || febSlot.income !== 15000 || febSlot.expenses !== 7000 || febSlot.net !== 8000) {
      throw new Error(`Feb 2026 aggregation incorrect: ${JSON.stringify(febSlot)}`);
    }
    console.log('  ✅ 200 OK: Monthly trend accurately grouped Jan (Income 50k, Exp 12k, Net 38k) and Feb (Income 15k, Exp 7k, Net 8k)');

    // [6] Test /api/dashboard/categories expense breakdown
    console.log('\n[6] Testing /api/dashboard/categories expense breakdown...');
    const catRes = await fetch(`${baseUrl}/dashboard/categories?type=expense`, {
      headers: { Authorization: `Bearer ${userAToken}` },
    });
    const catData = await catRes.json();
    if (catRes.status !== 200 || !catData.success) {
      throw new Error(`Failed to fetch categories: ${JSON.stringify(catData)}`);
    }

    if (catData.data.totalAmount !== 19000) {
      throw new Error(`Expected category totalAmount 19000, got ${catData.data.totalAmount}`);
    }
    const housing = catData.data.categories.find((c) => c.category === 'Housing & Rent');
    const food = catData.data.categories.find((c) => c.category === 'Food & Dining');
    const utils = catData.data.categories.find((c) => c.category === 'Utilities');

    if (!housing || housing.total !== 12000 || housing.percentage !== 63.2) {
      throw new Error(`Housing category calculation incorrect: ${JSON.stringify(housing)}`);
    }
    if (!food || food.total !== 4500 || food.percentage !== 23.7) {
      throw new Error(`Food category calculation incorrect: ${JSON.stringify(food)}`);
    }
    if (!utils || utils.total !== 2500 || utils.percentage !== 13.2) {
      throw new Error(`Utilities category calculation incorrect: ${JSON.stringify(utils)}`);
    }
    console.log('  ✅ 200 OK: Categories breakdown accurately ranked Housing (63.2%), Food (23.7%), Utilities (13.2%)');

    // [7] Test date range filtering on /api/dashboard/summary
    console.log('\n[7] Testing date range filtering on /api/dashboard/summary...');
    const filteredRes = await fetch(
      `${baseUrl}/dashboard/summary?startDate=2026-02-01&endDate=2026-02-28`,
      { headers: { Authorization: `Bearer ${userAToken}` } }
    );
    const filteredData = await filteredRes.json();
    if (
      filteredData.data.summary.totalIncome !== 15000 ||
      filteredData.data.summary.totalExpenses !== 7000 ||
      filteredData.data.summary.netBalance !== 8000
    ) {
      throw new Error(`Date range filtered summary incorrect: ${JSON.stringify(filteredData)}`);
    }
    console.log('  ✅ 200 OK: Date range filter accurately isolated February metrics (Income 15k, Exp 7k, Net 8k)');

    // [8] Test invalid date query validation (400)
    console.log('\n[8] Testing invalid date query rejection (400)...');
    const invalidDateRes = await fetch(`${baseUrl}/dashboard/summary?startDate=not-a-date`, {
      headers: { Authorization: `Bearer ${userAToken}` },
    });
    if (invalidDateRes.status !== 400) {
      throw new Error(`Expected 400 for invalid date, got ${invalidDateRes.status}`);
    }
    console.log('  ✅ 400 Bad Request: Correctly caught malformed date parameter');

    // [9] Test startDate > endDate validation (400)
    console.log('\n[9] Testing startDate > endDate validation rejection (400)...');
    const rangeErrorRes = await fetch(
      `${baseUrl}/dashboard/summary?startDate=2026-05-01&endDate=2026-01-01`,
      { headers: { Authorization: `Bearer ${userAToken}` } }
    );
    if (rangeErrorRes.status !== 400) {
      throw new Error(`Expected 400 for inverted date range, got ${rangeErrorRes.status}`);
    }
    console.log('  ✅ 400 Bad Request: Correctly rejected inverted date boundaries');

    // [10] SECURITY ISOLATION: User B queries dashboard endpoints and gets 0 leakage
    console.log('\n[10] Testing SECURITY ISOLATION: User B queries dashboard (Zero data leakage)...');
    const userBSummaryRes = await fetch(`${baseUrl}/dashboard/summary`, {
      headers: { Authorization: `Bearer ${userBToken}` },
    });
    const userBSummaryData = await userBSummaryRes.json();
    if (
      userBSummaryData.data.summary.totalIncome !== 0 ||
      userBSummaryData.data.summary.totalExpenses !== 0 ||
      userBSummaryData.data.summary.netBalance !== 0 ||
      userBSummaryData.data.recentTransactions.length !== 0
    ) {
      throw new Error(`CRITICAL SECURITY LEAK: User B received financial data belonging to User A!`);
    }

    const userBCatRes = await fetch(`${baseUrl}/dashboard/categories?type=expense`, {
      headers: { Authorization: `Bearer ${userBToken}` },
    });
    const userBCatData = await userBCatRes.json();
    if (userBCatData.data.categories.length !== 0 || userBCatData.data.totalAmount !== 0) {
      throw new Error(`CRITICAL SECURITY LEAK: User B received category data belonging to User A!`);
    }
    console.log('  ✅ 200 OK: Strict multi-tenant isolation verified (User B receives 0 totals, 0 transactions, 0 categories)');

    console.log('\n🎉 10/10 Dashboard Financial Aggregation & Security Tests Passed Successfully!\n');
  } finally {
    // Teardown
    await Transaction.deleteMany({ user: { $in: [userAId, userBId] } });
    await User.deleteMany({ _id: { $in: [userAId, userBId] } });
    testServer.close();
    await mongoose.connection.close();
  }
};

runDashboardIntegrationTests().catch((err) => {
  console.error('❌ Dashboard Test Suite Failed:', err);
  process.exit(1);
});
