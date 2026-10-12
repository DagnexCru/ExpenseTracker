import { describe, it } from 'node:test';
import assert from 'node:assert';
import request from 'supertest';
import app from '../../src/app.js';

describe('Integration: 13 - Login Missing Required Fields', () => {
  it('should return 400 Bad Request when email or password is missing', async () => {
    const resNoEmail = await request(app)
      .post('/api/auth/login')
      .send({ password: 'SomePassword123!' });

    assert.strictEqual(resNoEmail.status, 400);
    assert.strictEqual(resNoEmail.body.error.code, 'VALIDATION_ERROR');

    const resNoPassword = await request(app)
      .post('/api/auth/login')
      .send({ email: 'user@spendwise.et' });

    assert.strictEqual(resNoPassword.status, 400);
    assert.strictEqual(resNoPassword.body.error.code, 'VALIDATION_ERROR');
  });
});
