import { describe, it, before, after } from 'node:test';
import assert from 'node:assert';
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../src/app.js';
import User from '../src/models/User.js';
import Transaction from '../src/models/Transaction.js';

describe('Integration: Transaction CRUD & Security Isolation Suites', () => {
  let userAToken;
  let userACookie;
  let userBToken;
  let userBCookie;
  let userAId;
  let userBId;
  let userATransactionId;

  const userACreds = {
    name: 'Alice Investor',
    email: `alice_tx_${Date.now()}@spendwise.et`,
    password: 'Password123!',
  };

  const userBCreds = {
    name: 'Bob Spender',
    email: `bob_tx_${Date.now()}@spendwise.et`,
    password: 'Password123!',
  };

  before(async () => {
    if (mongoose.connection.readyState === 0) {
      const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/expensetracker';
      await mongoose.connect(mongoUri);
    }

    // Register User A
    const resA = await request(app).post('/api/auth/register').send(userACreds);
    userAToken = resA.body.data.token;
    userACookie = resA.headers['set-cookie'];
    userAId = resA.body.data.user.id;

    // Register User B
    const resB = await request(app).post('/api/auth/register').send(userBCreds);
    userBToken = resB.body.data.token;
    userBCookie = resB.headers['set-cookie'];
    userBId = resB.body.data.user.id;
  });

  after(async () => {
    await Transaction.deleteMany({ user: { $in: [userAId, userBId] } });
    await User.deleteMany({ _id: { $in: [userAId, userBId] } });
  });

  it('[1] should reject transaction creation without authentication (401)', async () => {
    const res = await request(app).post('/api/transactions').send({
      type: 'expense',
      amount: 100,
      category: 'Food & Dining',
    });
    assert.strictEqual(res.status, 401);
  });

  it('[2] should reject transaction creation with invalid amount <= 0 (400)', async () => {
    const res = await request(app)
      .post('/api/transactions')
      .set('Authorization', `Bearer ${userAToken}`)
      .send({
        type: 'expense',
        amount: -50,
        category: 'Food & Dining',
      });
    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.body.error.code, 'VALIDATION_ERROR');
  });

  it('[3] should reject category mismatch with transaction type (400)', async () => {
    const res = await request(app)
      .post('/api/transactions')
      .set('Authorization', `Bearer ${userAToken}`)
      .send({
        type: 'income',
        amount: 2500,
        category: 'Food & Dining', // Food is an expense category
      });
    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.body.error.code, 'VALIDATION_ERROR');
  });

  it('[4] should create a valid transaction for User A (201)', async () => {
    const res = await request(app)
      .post('/api/transactions')
      .set('Authorization', `Bearer ${userAToken}`)
      .send({
        type: 'expense',
        amount: 1250.75,
        category: 'Food & Dining',
        description: 'Monthly grocery shopping',
        paymentMethod: 'bank_transfer',
      });

    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.body.success, true);
    assert.ok(res.body.data.transaction.id);
    assert.strictEqual(res.body.data.transaction.amount, 1250.75);
    assert.strictEqual(res.body.data.transaction.category, 'Food & Dining');
    assert.strictEqual(res.body.data.transaction.paymentMethod, 'bank_transfer');
    userATransactionId = res.body.data.transaction.id;
  });

  it('[5] should list all transactions belonging to User A (200)', async () => {
    const res = await request(app)
      .get('/api/transactions')
      .set('Authorization', `Bearer ${userAToken}`);

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.count, 1);
    assert.strictEqual(res.body.data.transactions[0].id, userATransactionId);
  });

  it('[6] should retrieve single transaction by ID for User A (200)', async () => {
    const res = await request(app)
      .get(`/api/transactions/${userATransactionId}`)
      .set('Authorization', `Bearer ${userAToken}`);

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.data.transaction.id, userATransactionId);
  });

  it('[7] should update an existing transaction for User A (200)', async () => {
    const res = await request(app)
      .put(`/api/transactions/${userATransactionId}`)
      .set('Authorization', `Bearer ${userAToken}`)
      .send({
        amount: 1500,
        description: 'Updated grocery amount',
      });

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.data.transaction.amount, 1500);
    assert.strictEqual(res.body.data.transaction.description, 'Updated grocery amount');
  });

  it('[8] SECURITY ISOLATION: User B CANNOT read User A transaction (404)', async () => {
    const res = await request(app)
      .get(`/api/transactions/${userATransactionId}`)
      .set('Authorization', `Bearer ${userBToken}`);

    assert.strictEqual(res.status, 404);
    assert.strictEqual(res.body.error.code, 'TRANSACTION_NOT_FOUND');
  });

  it('[9] SECURITY ISOLATION: User B CANNOT update User A transaction (404)', async () => {
    const res = await request(app)
      .put(`/api/transactions/${userATransactionId}`)
      .set('Authorization', `Bearer ${userBToken}`)
      .send({ amount: 999999 });

    assert.strictEqual(res.status, 404);
    assert.strictEqual(res.body.error.code, 'TRANSACTION_NOT_FOUND');
  });

  it('[10] SECURITY ISOLATION: User B CANNOT delete User A transaction (404)', async () => {
    const res = await request(app)
      .delete(`/api/transactions/${userATransactionId}`)
      .set('Authorization', `Bearer ${userBToken}`);

    assert.strictEqual(res.status, 404);
    assert.strictEqual(res.body.error.code, 'TRANSACTION_NOT_FOUND');
  });

  it('[11] should delete transaction by owner User A (200)', async () => {
    const res = await request(app)
      .delete(`/api/transactions/${userATransactionId}`)
      .set('Authorization', `Bearer ${userAToken}`);

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);

    // Verify it is gone
    const verifyRes = await request(app)
      .get(`/api/transactions/${userATransactionId}`)
      .set('Authorization', `Bearer ${userAToken}`);
    assert.strictEqual(verifyRes.status, 404);
  });
});
