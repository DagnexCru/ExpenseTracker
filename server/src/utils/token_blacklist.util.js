/**
 * @file token_blacklist.util.js
 * @description In-memory token revocation cache for JWT invalidation on logout
 */

class TokenBlacklist {
  constructor() {
    this.blacklistedTokens = new Set();
  }

  /**
   * Adds a token string to the blacklist
   * @param {string} token
   */
  revoke(token) {
    if (token && typeof token === 'string') {
      this.blacklistedTokens.add(token);
    }
  }

  /**
   * Checks if a token is in the blacklist
   * @param {string} token
   * @returns {boolean}
   */
  isRevoked(token) {
    if (!token || typeof token !== 'string') return false;
    return this.blacklistedTokens.has(token);
  }

  /**
   * Clears all revoked tokens (useful for test resets)
   */
  clear() {
    this.blacklistedTokens.clear();
  }
}

export const tokenBlacklist = new TokenBlacklist();
