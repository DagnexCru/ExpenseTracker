import { describe, it } from 'node:test';
import assert from 'node:assert';
import request from 'supertest';
import app from '../../src/app.js';

describe('Integration: 16 - GET /me Unauthorized (No Credentials)', () => {
  it('should return 401 Unauthorized when neither cookie nor Bearer token is provided', async () => {
    const res = await request(app).get('/api/auth/me');

    assert.strictEqual(res.status, 401);
    assert.strictEqual(res.body.success, false);
    assert.strictEqual(res.body.error.code, 'UNAUTHORIZED');
  });
});
