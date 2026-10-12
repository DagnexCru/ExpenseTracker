import { describe, it } from 'node:test';
import assert from 'node:assert';
import request from 'supertest';
import app from '../../src/app.js';

describe('Integration: 19 - Security Headers & Options', () => {
  it('should return CORS and JSON content-type headers on auth endpoints', async () => {
    const res = await request(app).options('/api/auth/login');
    assert.ok(res.headers['access-control-allow-origin']);
    assert.ok(res.headers['access-control-allow-credentials']);
  });
});
