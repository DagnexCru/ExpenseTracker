import { describe, it } from 'node:test';
import assert from 'node:assert';
import request from 'supertest';
import app from '../../src/app.js';

describe('Integration: 20 - Auth Empty Body Handling', () => {
  it('should reject registration with empty body {} with 400 Bad Request', async () => {
    const res = await request(app).post('/api/auth/register').send({});
    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.body.success, false);
    assert.strictEqual(res.body.error.code, 'VALIDATION_ERROR');
  });

  it('should reject login with empty body {} with 400 Bad Request', async () => {
    const res = await request(app).post('/api/auth/login').send({});
    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.body.success, false);
    assert.strictEqual(res.body.error.code, 'VALIDATION_ERROR');
  });
});
