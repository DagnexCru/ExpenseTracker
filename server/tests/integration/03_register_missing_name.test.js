import { describe, it } from 'node:test';
import assert from 'node:assert';
import request from 'supertest';
import app from '../../src/app.js';

describe('Integration: 03 - Registration Missing Name', () => {
  it('should reject registration when name is missing with 400 Bad Request', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'noname@spendwise.et',
        password: 'Password123!',
      });

    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.body.success, false);
    assert.strictEqual(res.body.error.code, 'VALIDATION_ERROR');
    const hasNameError = res.body.error.details.some(d => d.field === 'name');
    assert.ok(hasNameError, 'Validation error must specify name field');
  });
});
