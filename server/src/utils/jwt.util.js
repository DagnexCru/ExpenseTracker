import jwt from 'jsonwebtoken';

/**
 * Signs a new JWT for an authenticated user
 * @param {object} payload - Claims to include in token (e.g. { id, email })
 * @param {string} [expiresIn] - Expiration duration string (defaults to JWT_EXPIRES_IN or '7d')
 * @returns {string} signed JWT string
 */
export const generateToken = (payload, expiresIn) => {
  const secret = process.env.JWT_SECRET || 'fallback_development_secret_key_change_in_production';
  const expiry = expiresIn || process.env.JWT_EXPIRES_IN || '7d';

  return jwt.sign(payload, secret, {
    expiresIn: expiry,
  });
};

/**
 * Verifies a JWT signature and returns decoded claims
 * @param {string} token
 * @returns {object} decoded token payload
 * @throws {Error} if token is invalid or expired
 */
export const verifyToken = (token) => {
  const secret = process.env.JWT_SECRET || 'fallback_development_secret_key_change_in_production';
  return jwt.verify(token, secret);
};

export default {
  generateToken,
  verifyToken,
};
