import { describe, it } from 'node:test';
import assert from 'node:assert';
import request from 'supertest';
import app from '../../src/app.js';

describe('Integration: 06 - Registration Malformed Email', () => {
  it('should reject malformed email address with 400 Bad Request', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Valid Name',
        email: 'invalid-email-address',
        password: 'Password123!',
      });

    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.body.success, false);
    assert.strictEqual(res.body.error.code, 'VALIDATION_ERROR');
    const emailErr = res.body.error.details.find(d => d.field === 'email');
    assert.ok(emailErr, 'Should specify email pattern error');
  });
});
