import { describe, it } from 'node:test';
import assert from 'node:assert';
import { validate } from '../../src/middleware/validate.middleware.js';

describe('Validation Runner Middleware Tests', () => {
  it('should call next() when validator reports isValid true', () => {
    let nextCalled = false;
    const middleware = validate(() => ({ isValid: true, errors: [] }));
    const req = { body: {} };
    const res = {};
    const next = () => { nextCalled = true; };

    middleware(req, res, next);
    assert.strictEqual(nextCalled, true);
  });

  it('should respond with 400 when validator reports isValid false', () => {
    const middleware = validate(() => ({
      isValid: false,
      errors: [{ field: 'email', message: 'Email is required' }],
    }));
    const req = { body: {} };
    const res = {
      status(code) {
        this.statusCode = code;
        return this;
      },
      json(payload) {
        this.body = payload;
      },
    };
    const next = () => {};

    middleware(req, res, next);
    assert.strictEqual(res.statusCode, 400);
    assert.strictEqual(res.body.error.code, 'VALIDATION_ERROR');
    assert.strictEqual(res.body.error.details.length, 1);
  });
});
