import { describe, it } from 'node:test';
import assert from 'node:assert';
import request from 'supertest';
import app from '../../src/app.js';

describe('Integration: 04 - Registration Short Name', () => {
  it('should reject registration when name is less than 2 characters with 400 Bad Request', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'A',
        email: 'shortname@spendwise.et',
        password: 'Password123!',
      });

    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.body.success, false);
    assert.strictEqual(res.body.error.code, 'VALIDATION_ERROR');
    const nameErr = res.body.error.details.find(d => d.field === 'name');
    assert.ok(nameErr, 'Should specify name validation error');
  });
});
