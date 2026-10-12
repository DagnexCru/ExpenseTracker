import { describe, it, before, after } from 'node:test';
import assert from 'node:assert';
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../src/app.js';
import User from '../../src/models/User.js';

describe('Integration: 01 - Registration Success', () => {
  before(async () => {
    if (mongoose.connection.readyState === 0) {
      const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/expensetracker';
      await mongoose.connect(mongoUri);
    }
    await User.deleteMany({ email: 'test.reg01@spendwise.et' });
  });

  after(async () => {
    await User.deleteMany({ email: 'test.reg01@spendwise.et' });
  });

  it('should register a new user with 201 Created and return valid JWT and user object', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Register One',
        email: 'test.reg01@spendwise.et',
        password: 'Password123!',
        currency: 'ETB',
      });

    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.body.success, true);
    assert.ok(res.body.data.token, 'Should return JWT token');
    assert.strictEqual(res.body.data.user.email, 'test.reg01@spendwise.et');
    assert.strictEqual(res.body.data.user.password, undefined, 'Password should never be returned');
    assert.ok(res.headers['set-cookie'], 'Should set HTTP-only cookie');
  });
});
