import http from 'http';
import mongoose from 'mongoose';
import app from '../src/app.js';
import User from '../src/models/User.js';
import Transaction from '../src/models/Transaction.js';
import { connectDB } from '../src/config/db.js';

const runSearchFilterTests = async () => {
  console.log('🧪 Starting Full Phase 5: Transaction Search, Filtering, Sorting & Pagination Test Suite...\n');

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
        name: 'Filter Tester A',
        email: `filter_a_${timestamp}@example.com`,
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
        name: 'Filter Tester B',
        email: `filter_b_${timestamp}@example.com`,
        password: 'Password123!',
      }),
    });
    const userBData = await userBRes.json();
    userBToken = userBData.data.token;
    userBId = userBData.data.user._id || userBData.data.user.id;

    // 2. Seed User A with 5 diverse transactions
    console.log('[Setup] Seeding 5 test transactions for User A...');
    const seedData = [
      {
        user: userAId,
        type: 'expense',
        amount: 800.0,
        category: 'Food & Dining',
        description: 'Supermarket weekly grocery basket',
        date: new Date('2026-03-01T10:00:00Z'),
        paymentMethod: 'cash',
      },
      {
        user: userAId,
        type: 'expense',
        amount: 15000.0,
        category: 'Housing & Rent',
        description: 'Monthly residential flat rental payment',
        date: new Date('2026-03-05T09:00:00Z'),
        paymentMethod: 'bank_transfer',
      },
      {
        user: userAId,
        type: 'expense',
        amount: 450.0,
        category: 'Transportation',
        description: 'City taxi ride to conference',
        date: new Date('2026-03-10T14:00:00Z'),
        paymentMethod: 'mobile_money',
      },
      {
        user: userAId,
        type: 'income',
        amount: 60000.0,
        category: 'Salary',
        description: 'Full-time senior engineering salary',
        date: new Date('2026-03-15T12:00:00Z'),
        paymentMethod: 'bank_transfer',
      },
      {
        user: userAId,
        type: 'income',
        amount: 12000.0,
        category: 'Freelance & Consulting',
        description: 'Freelance web application design audit',
        date: new Date('2026-03-20T16:00:00Z'),
        paymentMethod: 'mobile_money',
      },
    ];
    await Transaction.insertMany(seedData);
    console.log('  ✅ Seeded 5 test transactions\n');

    // [1] Description search filtering
    console.log('[1] Testing case-insensitive description search (?search=grocery)...');
    const searchRes = await fetch(`${baseUrl}/transactions?search=grocery`, {
      headers: { Authorization: `Bearer ${userAToken}` },
    });
    const searchData = await searchRes.json();
    if (searchRes.status !== 200 || searchData.count !== 1) {
      throw new Error(`Expected count 1 for 'grocery' search, got ${searchData.count}`);
    }
    if (!searchData.data.transactions[0].description.includes('grocery')) {
      throw new Error('Search did not return the expected grocery transaction');
    }
    console.log('  ✅ 200 OK: Regex search accurately isolated matching description');

    // [2] Category filtering
    console.log('\n[2] Testing category filter (?category=Transportation)...');
    const catRes = await fetch(`${baseUrl}/transactions?category=Transportation`, {
      headers: { Authorization: `Bearer ${userAToken}` },
    });
    const catData = await catRes.json();
    if (catRes.status !== 200 || catData.count !== 1 || catData.data.transactions[0].amount !== 450) {
      throw new Error(`Expected 1 transportation record, got ${catData.count}`);
    }
    console.log('  ✅ 200 OK: Category filter accurately returned only Transportation records');

    // [3] Type filtering
    console.log('\n[3] Testing type filter (?type=income)...');
    const typeRes = await fetch(`${baseUrl}/transactions?type=income`, {
      headers: { Authorization: `Bearer ${userAToken}` },
    });
    const typeData = await typeRes.json();
    if (typeRes.status !== 200 || typeData.count !== 2) {
      throw new Error(`Expected 2 income records, got ${typeData.count}`);
    }
    console.log('  ✅ 200 OK: Type filter returned exactly the 2 income entries');

    // [4] Date-range filtering
    console.log('\n[4] Testing date range filter (?startDate=2026-03-01&endDate=2026-03-06)...');
    const dateRes = await fetch(`${baseUrl}/transactions?startDate=2026-03-01&endDate=2026-03-06`, {
      headers: { Authorization: `Bearer ${userAToken}` },
    });
    const dateData = await dateRes.json();
    if (dateRes.status !== 200 || dateData.count !== 2) {
      throw new Error(`Expected 2 records between March 1 and March 6, got ${dateData.count}`);
    }
    console.log('  ✅ 200 OK: Date bounds accurately captured matching transactions');

    // [5] Amount range filtering
    console.log('\n[5] Testing amount bounds (?minAmount=500&maxAmount=1000)...');
    const amtRes = await fetch(`${baseUrl}/transactions?minAmount=500&maxAmount=1000`, {
      headers: { Authorization: `Bearer ${userAToken}` },
    });
    const amtData = await amtRes.json();
    if (amtRes.status !== 200 || amtData.count !== 1 || amtData.data.transactions[0].amount !== 800) {
      throw new Error(`Expected 1 transaction between 500 and 1000, got ${amtData.count}`);
    }
    console.log('  ✅ 200 OK: Amount bounds accurately isolated the 800.00 ETB transaction');

    // [6] Sorting by amount descending
    console.log('\n[6] Testing sorting by amount descending (?sortBy=amount&sortOrder=desc)...');
    const sortDescRes = await fetch(`${baseUrl}/transactions?sortBy=amount&sortOrder=desc`, {
      headers: { Authorization: `Bearer ${userAToken}` },
    });
    const sortDescData = await sortDescRes.json();
    if (sortDescRes.status !== 200 || sortDescData.data.transactions[0].amount !== 60000) {
      throw new Error(`Expected highest amount first (60000), got ${sortDescData.data.transactions[0].amount}`);
    }
    console.log('  ✅ 200 OK: Sorting descending placed highest amount (60,000) first');

    // [7] Sorting by amount ascending
    console.log('\n[7] Testing sorting by amount ascending (?sortBy=amount&sortOrder=asc)...');
    const sortAscRes = await fetch(`${baseUrl}/transactions?sortBy=amount&sortOrder=asc`, {
      headers: { Authorization: `Bearer ${userAToken}` },
    });
    const sortAscData = await sortAscRes.json();
    if (sortAscRes.status !== 200 || sortAscData.data.transactions[0].amount !== 450) {
      throw new Error(`Expected lowest amount first (450), got ${sortAscData.data.transactions[0].amount}`);
    }
    console.log('  ✅ 200 OK: Sorting ascending placed lowest amount (450) first');

    // [8] Pagination: Page 1 and Page 2
    console.log('\n[8] Testing pagination metadata and page slicing (?page=1&limit=2)...');
    const page1Res = await fetch(`${baseUrl}/transactions?page=1&limit=2`, {
      headers: { Authorization: `Bearer ${userAToken}` },
    });
    const page1Data = await page1Res.json();
    if (
      page1Res.status !== 200 ||
      page1Data.count !== 2 ||
      page1Data.pagination.totalCount !== 5 ||
      page1Data.pagination.totalPages !== 3 ||
      page1Data.pagination.hasNextPage !== true ||
      page1Data.pagination.hasPrevPage !== false
    ) {
      throw new Error(`Page 1 pagination metadata incorrect: ${JSON.stringify(page1Data.pagination)}`);
    }

    const page2Res = await fetch(`${baseUrl}/transactions?page=2&limit=2`, {
      headers: { Authorization: `Bearer ${userAToken}` },
    });
    const page2Data = await page2Res.json();
    if (
      page2Res.status !== 200 ||
      page2Data.count !== 2 ||
      page2Data.pagination.hasPrevPage !== true ||
      page2Data.pagination.hasNextPage !== true
    ) {
      throw new Error(`Page 2 pagination metadata incorrect: ${JSON.stringify(page2Data.pagination)}`);
    }
    console.log('  ✅ 200 OK: Pagination accurately returned sliced items and totalPages: 3, hasNextPage: true');

    // [9] Negative test: Invalid sort field rejection (400)
    console.log('\n[9] Testing rejection of invalid sort field (?sortBy=invalidField)...');
    const invalidSortRes = await fetch(`${baseUrl}/transactions?sortBy=invalidField`, {
      headers: { Authorization: `Bearer ${userAToken}` },
    });
    if (invalidSortRes.status !== 400) {
      throw new Error(`Expected 400 for invalid sort field, got ${invalidSortRes.status}`);
    }
    console.log('  ✅ 400 Bad Request: Validation intercepted unrecognized sort parameter');

    // [10] Negative test: Inverted date boundaries rejection (400)
    console.log('\n[10] Testing rejection of inverted date boundaries...');
    const invertedDateRes = await fetch(
      `${baseUrl}/transactions?startDate=2026-03-25&endDate=2026-03-01`,
      { headers: { Authorization: `Bearer ${userAToken}` } }
    );
    if (invertedDateRes.status !== 400) {
      throw new Error(`Expected 400 for inverted date boundaries, got ${invertedDateRes.status}`);
    }
    console.log('  ✅ 400 Bad Request: Validation intercepted startDate > endDate');

    // [11] Multi-tenant isolation: User B gets 0 items when querying
    console.log('\n[11] Testing multi-tenant security isolation (User B receives 0 records)...');
    const userBListRes = await fetch(`${baseUrl}/transactions`, {
      headers: { Authorization: `Bearer ${userBToken}` },
    });
    const userBListData = await userBListRes.json();
    if (userBListData.count !== 0 || userBListData.pagination.totalCount !== 0) {
      throw new Error(`CRITICAL SECURITY FAILURE: User B can see User A transactions!`);
    }
    console.log('  ✅ 200 OK: Multi-tenant boundary strictly maintained (User B received 0 records)');

    console.log('\n🎉 11/11 Transaction Search, Filtering, Sorting & Pagination Tests Passed Successfully!\n');
  } finally {
    // Teardown
    await Transaction.deleteMany({ user: { $in: [userAId, userBId] } });
    await User.deleteMany({ _id: { $in: [userAId, userBId] } });
    testServer.close();
    await mongoose.connection.close();
  }
};

runSearchFilterTests().catch((err) => {
  console.error('❌ Search & Filter Test Suite Failed:', err);
  process.exit(1);
});
