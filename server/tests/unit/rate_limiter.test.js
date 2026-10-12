import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert';
import { createRateLimiter, resetRateLimits } from '../../src/middleware/rate_limiter.middleware.js';

describe('Rate Limiter Middleware Tests', () => {
  beforeEach(() => {
    resetRateLimits();
  });

  it('should allow requests under the limit threshold', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development'; // enable limiter logic

    const limiter = createRateLimiter({ windowMs: 60000, max: 2 });
    let passed = 0;
    const req = { ip: '127.0.0.1', headers: {}, socket: {} };
    const res = {
      status(code) {
        this.statusCode = code;
        return this;
      },
      json(payload) {
        this.body = payload;
      },
    };
    const next = () => { passed++; };

    limiter(req, res, next);
    limiter(req, res, next);
    assert.strictEqual(passed, 2);

    // 3rd hit exceeds limit
    limiter(req, res, next);
    assert.strictEqual(res.statusCode, 429);
    assert.strictEqual(res.body.error.code, 'RATE_LIMIT_EXCEEDED');

    process.env.NODE_ENV = originalEnv;
  });
});
