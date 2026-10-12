/**
 * @file validation.js
 * @description Frontend form validation utilities and regular expressions
 */

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validates registration form inputs on client side.
 *
 * @param {Object} values
 * @param {string} values.name
 * @param {string} values.email
 * @param {string} values.password
 * @returns {{ isValid: boolean, errors: Object.<string, string> }}
 */
export const validateRegisterForm = ({ name, email, password }) => {
  const errors = {};

  if (!name || !name.trim()) {
    errors.name = 'Full name is required.';
  } else if (name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters.';
  } else if (name.trim().length > 50) {
    errors.name = 'Name cannot exceed 50 characters.';
  }

  if (!email || !email.trim()) {
    errors.email = 'Email address is required.';
  } else if (!EMAIL_REGEX.test(email.trim())) {
    errors.email = 'Please provide a valid email address.';
  }

  if (!password) {
    errors.password = 'Password is required.';
  } else if (password.length < 6) {
    errors.password = 'Password must be at least 6 characters.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validates login form inputs on client side.
 *
 * @param {Object} values
 * @param {string} values.email
 * @param {string} values.password
 * @returns {{ isValid: boolean, errors: Object.<string, string> }}
 */
export const validateLoginForm = ({ email, password }) => {
  const errors = {};

  if (!email || !email.trim()) {
    errors.email = 'Email address is required.';
  } else if (!EMAIL_REGEX.test(email.trim())) {
    errors.email = 'Please provide a valid email address.';
  }

  if (!password) {
    errors.password = 'Password is required.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
