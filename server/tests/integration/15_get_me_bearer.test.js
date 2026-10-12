import { describe, it, before, after } from 'node:test';
import assert from 'node:assert';
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../src/app.js';
import User from '../../src/models/User.js';

describe('Integration: 15 - GET /me via Bearer Token Header', () => {
  const credentials = {
    name: 'Bearer Profile User',
    email: 'bearer.user15@spendwise.et',
    password: 'Password123!',
  };
  let authToken;

  before(async () => {
    if (mongoose.connection.readyState === 0) {
      const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/expensetracker';
      await mongoose.connect(mongoUri);
    }
    await User.deleteMany({ email: credentials.email });
    const regRes = await request(app).post('/api/auth/register').send(credentials);
    authToken = regRes.body.data.token;
  });

  after(async () => {
    await User.deleteMany({ email: credentials.email });
  });

  it('should authenticate user via Authorization Bearer header and return profile', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${authToken}`);

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.data.user.email, credentials.email);
    assert.strictEqual(res.body.data.user.name, credentials.name);
  });
});
