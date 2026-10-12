import { describe, it, before, after } from 'node:test';
import assert from 'node:assert';
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../src/app.js';
import User from '../../src/models/User.js';

describe('Integration: 14 - GET /me via HTTP-Only Cookie', () => {
  const credentials = {
    name: 'Cookie Profile User',
    email: 'cookie.user14@spendwise.et',
    password: 'Password123!',
  };
  let cookieHeader;

  before(async () => {
    if (mongoose.connection.readyState === 0) {
      const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/expensetracker';
      await mongoose.connect(mongoUri);
    }
    await User.deleteMany({ email: credentials.email });
    const regRes = await request(app).post('/api/auth/register').send(credentials);
    cookieHeader = regRes.headers['set-cookie'];
  });

  after(async () => {
    await User.deleteMany({ email: credentials.email });
  });

  it('should authenticate user via cookie and return profile data', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Cookie', cookieHeader);

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.data.user.email, credentials.email);
    assert.strictEqual(res.body.data.user.name, credentials.name);
    assert.strictEqual(res.body.data.user.password, undefined);
  });
});
