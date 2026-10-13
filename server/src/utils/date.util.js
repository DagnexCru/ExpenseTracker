/**
 * @file date.util.js
 * @description Date normalization and validation utilities for transactions
 */

/**
 * Validates whether an input is a valid date string or Date instance.
 *
 * @param {any} value
 * @returns {boolean}
 */
export const isValidDate = (value) => {
  if (!value) return false;
  const date = new Date(value);
  const timestamp = date.getTime();
  if (isNaN(timestamp)) return false;

  // Reject dates before year 2000 or more than 10 years into the future
  const year = date.getFullYear();
  return year >= 2000 && year <= 2040;
};

/**
 * Normalizes a date input to a standard Date instance.
 *
 * @param {any} value
 * @returns {Date}
 */
export const normalizeDate = (value) => {
  if (!value) return new Date();
  const date = new Date(value);
  return isNaN(date.getTime()) ? new Date() : date;
};
