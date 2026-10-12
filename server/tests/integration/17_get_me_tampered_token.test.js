import { describe, it } from 'node:test';
import assert from 'node:assert';
import request from 'supertest';
import app from '../../src/app.js';

describe('Integration: 17 - GET /me Tampered Token', () => {
  it('should return 401 Unauthorized when Bearer token signature is invalid or tampered', async () => {
    const tamperedToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MGEyM2Y4OTBhYmNkZWYwMTIzNDU2NyJ9.TAMPERED_FORGED_SIGNATURE';

    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${tamperedToken}`);

    assert.strictEqual(res.status, 401);
    assert.strictEqual(res.body.success, false);
    assert.strictEqual(res.body.error.code, 'INVALID_TOKEN');
  });
});
