/**
 * @file security.middleware.js
 * @description Centralized security headers, parameter sanitization, and NoSQL injection defense
 */

/**
 * Applies OWASP recommended security headers to all HTTP responses
 */
export const securityHeaders = (req, res, next) => {
  // Prevent MIME-sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');

  // Clickjacking defense: Deny rendering in frames/iframes
  res.setHeader('X-Frame-Options', 'DENY');

  // Cross-Site Scripting (XSS) filter
  res.setHeader('X-XSS-Protection', '1; mode=block');

  // Referrer Policy: Send referrer only for same-origin or HTTPS requests
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Restrict sensitive browser APIs
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  next();
};

/**
 * Recursively sanitizes objects against MongoDB operator injection ($gt, $ne, $where, etc.)
 * @param {Object} obj
 */
const sanitizeObject = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;

  for (const key of Object.keys(obj)) {
    if (key.startsWith('$') || key.includes('.')) {
      delete obj[key];
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      sanitizeObject(obj[key]);
    }
  }

  return obj;
};

/**
 * Sanitizes req.body, req.query, and req.params against NoSQL query selector injection
 */
export const sanitizeNoSql = (req, res, next) => {
  if (req.body) sanitizeObject(req.body);
  if (req.params) sanitizeObject(req.params);
  // Sanitize query except intentional query parameters handled by validators
  if (req.query) sanitizeObject(req.query);

  next();
};

export default {
  securityHeaders,
  sanitizeNoSql,
};
