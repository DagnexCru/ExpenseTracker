import { describe, it } from 'node:test';
import assert from 'node:assert';
import request from 'supertest';
import app from '../../src/app.js';

describe('Integration: 12 - Login Nonexistent User', () => {
  it('should return 401 Unauthorized when attempting to login with unregistered email', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'ghost.user.nonexistent@spendwise.et',
        password: 'SomePassword123!',
      });

    assert.strictEqual(res.status, 401);
    assert.strictEqual(res.body.success, false);
    assert.strictEqual(res.body.error.code, 'INVALID_CREDENTIALS');
  });
});
