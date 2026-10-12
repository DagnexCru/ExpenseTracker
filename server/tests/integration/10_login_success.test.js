import { describe, it, before, after } from 'node:test';
import assert from 'node:assert';
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../src/app.js';
import User from '../../src/models/User.js';

describe('Integration: 10 - Login Success', () => {
  const credentials = {
    name: 'Login Tester',
    email: 'login.succ10@spendwise.et',
    password: 'SecurePassword123!',
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

  it('should authenticate user with valid credentials, return JWT and set cookie', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: credentials.email,
        password: credentials.password,
      });

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.ok(res.body.data.token, 'Should return JWT token on login');
    assert.strictEqual(res.body.data.user.email, credentials.email);
    assert.ok(res.headers['set-cookie'], 'Should set HTTP-only cookie');
  });
});
