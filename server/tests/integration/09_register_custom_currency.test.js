import { describe, it, before, after } from 'node:test';
import assert from 'node:assert';
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../src/app.js';
import User from '../../src/models/User.js';

describe('Integration: 09 - Registration Custom Currency', () => {
  before(async () => {
    if (mongoose.connection.readyState === 0) {
      const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/expensetracker';
      await mongoose.connect(mongoUri);
    }
    await User.deleteMany({ email: 'test.usd09@spendwise.et' });
  });

  after(async () => {
    await User.deleteMany({ email: 'test.usd09@spendwise.et' });
  });

  it('should accept and persist custom supported currency (USD)', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'USD User',
        email: 'test.usd09@spendwise.et',
        password: 'Password123!',
        currency: 'USD',
      });

    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.body.data.user.currency, 'USD');
  });
});
