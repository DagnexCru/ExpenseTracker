import { describe, it } from 'node:test';
import assert from 'node:assert';
import request from 'supertest';
import app from '../../src/app.js';

describe('Integration: 07 - Registration Short Password', () => {
  it('should reject registration when password is less than 6 characters with 400 Bad Request', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Valid Name',
        email: 'valid.user@spendwise.et',
        password: '123',
      });

    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.body.success, false);
    assert.strictEqual(res.body.error.code, 'VALIDATION_ERROR');
    const passErr = res.body.error.details.find(d => d.field === 'password');
    assert.ok(passErr, 'Should specify password min length error');
  });
});
