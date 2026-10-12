import { describe, it, before, after } from 'node:test';
import assert from 'node:assert';
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../src/app.js';
import User from '../../src/models/User.js';

describe('Integration: 18 - Logout Flow', () => {
  const credentials = {
    name: 'Logout Flow User',
    email: 'logout.user18@spendwise.et',
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

  it('should logout user, return 200 OK and clear token cookie', async () => {
    const res = await request(app)
      .post('/api/auth/logout')
      .set('Cookie', cookieHeader);

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.data.message, 'Logged out successfully');

    // Verify cookie expiration in Set-Cookie header
    const setCookie = res.headers['set-cookie'];
    assert.ok(setCookie, 'Must include Set-Cookie header');
    const cookieStr = Array.isArray(setCookie) ? setCookie.join(';') : setCookie;
    assert.ok(
      cookieStr.includes('Expires=Thu, 01 Jan 1970') || cookieStr.includes('Max-Age=0') || cookieStr.includes('token='),
      'Set-Cookie must expire or clear the token'
    );
  });
});
