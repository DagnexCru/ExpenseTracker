/**
 * @file amount.util.js
 * @description Monetary precision rounding and validation utilities
 */

/**
 * Normalizes an amount to 2 decimal places.
 *
 * @param {number|string} amount
 * @returns {number}
 */
export const normalizeAmount = (amount) => {
  const parsed = Number(amount);
  if (isNaN(parsed) || !isFinite(parsed)) return 0;
  return Math.round(parsed * 100) / 100;
};

export const roundMonetaryAmount = normalizeAmount;

/**
 * Validates that an amount is a strictly positive, finite number.
 *
 * @param {any} amount
 * @returns {boolean}
 */
export const isValidAmount = (amount) => {
  if (amount === null || amount === undefined || amount === '') return false;
  const num = Number(amount);
  if (isNaN(num) || !isFinite(num)) return false;
  return num > 0 && num <= 1000000000; // Cap at 1 billion per single transaction
};
