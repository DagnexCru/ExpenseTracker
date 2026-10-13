import { describe, it } from 'node:test';
import assert from 'node:assert';
import { resetRateLimits } from '../../src/middleware/rate_limiter.middleware.js';

describe('Unit: Rate Limiter Reset Utility', () => {
  it('should reset client hit cache without errors', () => {
    assert.doesNotThrow(() => {
      resetRateLimits();
    });
  });
});
