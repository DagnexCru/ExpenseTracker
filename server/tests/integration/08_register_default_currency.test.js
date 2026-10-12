import { describe, it, before, after } from 'node:test';
import assert from 'node:assert';
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../src/app.js';
import User from '../../src/models/User.js';

describe('Integration: 08 - Registration Default Currency', () => {
  before(async () => {
    if (mongoose.connection.readyState === 0) {
      const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/expensetracker';
      await mongoose.connect(mongoUri);
    }
    await User.deleteMany({ email: 'test.curr08@spendwise.et' });
  });

  after(async () => {
    await User.deleteMany({ email: 'test.curr08@spendwise.et' });
  });

  it('should default user currency to ETB when not explicitly provided', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Default Currency User',
        email: 'test.curr08@spendwise.et',
        password: 'Password123!',
      });

    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.body.data.user.currency, 'ETB');
  });
});
