/**
 * @file rate_limiter.middleware.js
 * @description In-memory IP-based rate limiting middleware for authentication endpoints
 */

const hitMap = new Map();

/**
 * Creates a rate limiting middleware for brute force protection.
 *
 * @param {Object} options
 * @param {number} options.windowMs - Time window in milliseconds (default 15 minutes)
 * @param {number} options.max - Maximum allowed requests per IP in the window
 * @param {string} options.message - Error message when limit exceeded
 */
export const createRateLimiter = ({
  windowMs = 15 * 60 * 1000,
  max = 100,
  message = 'Too many requests from this IP, please try again later.',
} = {}) => {
  return (req, res, next) => {
    // In test environment, skip rate limiting to avoid test interference
    if (process.env.NODE_ENV === 'test') {
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
      return res.status(429).json({
        success: false,
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message,
          retryAfterSeconds: Math.ceil((windowMs - (now - clientRecord.resetTime)) / 1000),
        },
      });
    }

    next();
  };
};

export const resetRateLimits = () => {
  hitMap.clear();
};
