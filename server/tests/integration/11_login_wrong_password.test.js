import { describe, it, before, after } from 'node:test';
import assert from 'node:assert';
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../src/app.js';
import User from '../../src/models/User.js';

describe('Integration: 11 - Login Wrong Password', () => {
  const credentials = {
    name: 'Wrong Pass Tester',
    email: 'login.wrongpass11@spendwise.et',
    password: 'CorrectPassword123!',
  };

  before(async () => {
    if (mongoose.connection.readyState === 0) {
      const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/expensetracker';
      await mongoose.connect(mongoUri);
    }
    await User.deleteMany({ email: credentials.email });
    await request(app).post('/api/auth/register').send(credentials);
  });

  after(async () => {
    await User.deleteMany({ email: credentials.email });
  });

  it('should return 401 Unauthorized when password does not match', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: credentials.email,
        password: 'IncorrectPassword999!',
      });

    assert.strictEqual(res.status, 401);
    assert.strictEqual(res.body.success, false);
    assert.strictEqual(res.body.error.code, 'INVALID_CREDENTIALS');
  });
});
