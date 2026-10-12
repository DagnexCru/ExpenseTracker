import { describe, it, before, after } from 'node:test';
import assert from 'node:assert';
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../src/app.js';
import User from '../../src/models/User.js';

describe('Integration: 02 - Registration Duplicate Email', () => {
  before(async () => {
    if (mongoose.connection.readyState === 0) {
      const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/expensetracker';
      await mongoose.connect(mongoUri);
    }
    await User.deleteMany({ email: 'test.dup02@spendwise.et' });
    await request(app).post('/api/auth/register').send({
      name: 'Existing User',
      email: 'test.dup02@spendwise.et',
      password: 'Password123!',
    });
  });

  after(async () => {
    await User.deleteMany({ email: 'test.dup02@spendwise.et' });
  });

  it('should reject duplicate email with 409 Conflict', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Another User',
        email: 'test.dup02@spendwise.et',
        password: 'AnotherPassword!',
      });

    assert.strictEqual(res.status, 409);
    assert.strictEqual(res.body.success, false);
    assert.strictEqual(res.body.error.code, 'EMAIL_ALREADY_EXISTS');
  });
});
