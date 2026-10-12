/**
 * @file auth.constants.js
 * @description Standardized authentication error codes, token durations, and cookie parameters
 */

export const AUTH_ERROR_CODES = Object.freeze({
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  EMAIL_ALREADY_EXISTS: 'EMAIL_ALREADY_EXISTS',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  UNAUTHORIZED: 'UNAUTHORIZED',
  INVALID_TOKEN: 'INVALID_TOKEN',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
});

export const JWT_CONFIG = Object.freeze({
  EXPIRES_IN: '7d',
  COOKIE_NAME: 'token',
  MAX_AGE_MS: 7 * 24 * 60 * 60 * 1000,
});
