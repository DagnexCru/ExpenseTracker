/**
 * @file rate_limiter.middleware.js
 * @description In-memory IP-based rate limiting middleware for authentication endpoints
 */

const hitMap = new Map();

/**
 * Creates a rate limiting middleware for brute force protection.
 *
 * @param {Object} options
 * @param {number} [options.windowMs=900000] - Time window in milliseconds (default 15 minutes)
 * @param {number} [options.max=20] - Maximum allowed requests per IP in the window
 * @param {string} [options.message] - Error message when limit exceeded
 * @param {boolean} [options.enforceInTest=false] - Whether to enforce during automated test runs
 */
export const createRateLimiter = ({
  windowMs = 15 * 60 * 1000,
  max = 20,
  message = 'Too many authentication attempts from this IP. Please try again after 15 minutes.',
  enforceInTest = false,
} = {}) => {
  return (req, res, next) => {
    // In test environment, skip rate limiting unless specifically testing rate limiter
    if (process.env.NODE_ENV === 'test' && !enforceInTest && !req.headers['x-test-rate-limit']) {
      return next();
    }

    const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown-ip';
    const now = Date.now();

    let clientRecord = hitMap.get(ip);

    if (!clientRecord || now - clientRecord.resetTime > windowMs) {
      clientRecord = {
        hits: 1,
        resetTime: now,
      };
      hitMap.set(ip, clientRecord);
      return next();
    }

    clientRecord.hits += 1;

    if (clientRecord.hits > max) {
      const retryAfterSeconds = Math.ceil((windowMs - (now - clientRecord.resetTime)) / 1000);
      res.setHeader('Retry-After', retryAfterSeconds);

      return res.status(429).json({
        success: false,
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message,
          retryAfterSeconds,
        },
      });
    }

    next();
  };
};

/**
 * Pre-configured rate limiter for authentication routes (login / register)
 */
export const authRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // 20 requests per IP per 15 minutes
  message: 'Too many authentication attempts from this IP. Please try again after 15 minutes.',
});

/**
 * Clear in-memory hit map for testing cleanup
 */
export const resetRateLimits = () => {
  hitMap.clear();
};

export default {
  createRateLimiter,
  authRateLimiter,
  resetRateLimits,
};
