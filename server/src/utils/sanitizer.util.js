/**
 * @file sanitizer.util.js
 * @description Input sanitization utility functions for auth endpoints
 */

/**
 * Sanitizes and normalizes an email address.
 * Removes leading/trailing whitespace and converts to lowercase.
 *
 * @param {string} email - Raw input email
 * @returns {string} Sanitized email
 */
export const sanitizeEmail = (email) => {
  if (typeof email !== 'string') return '';
  return email.trim().toLowerCase();
};

/**
 * Sanitizes generic user text (e.g., name).
 * Strips dangerous HTML tags and trims extraneous whitespace.
 *
 * @param {string} text - Raw input string
 * @returns {string} Sanitized string
 */
export const sanitizeName = (text) => {
  if (typeof text !== 'string') return '';
  return text
    .replace(/<[^>]*>?/gm, '') // Strip HTML tags
    .replace(/\s+/g, ' ')     // Collapse multiple spaces
    .trim();
};
