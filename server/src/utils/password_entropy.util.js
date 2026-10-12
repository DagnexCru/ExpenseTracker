/**
 * @file password_entropy.util.js
 * @description Evaluates password strength, entropy and security attributes
 */

/**
 * Calculates a password strength score from 0 to 4.
 *
 * @param {string} password
 * @returns {{ score: number, label: string, hasMinLength: boolean, hasUppercase: boolean, hasLowercase: boolean, hasNumber: boolean, hasSpecial: boolean }}
 */
export const calculatePasswordStrength = (password) => {
  if (!password || typeof password !== 'string') {
    return {
      score: 0,
      label: 'Too Short',
      hasMinLength: false,
      hasUppercase: false,
      hasLowercase: false,
      hasNumber: false,
      hasSpecial: false,
    };
  }

  const hasMinLength = password.length >= 6;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  let score = 0;
  if (hasMinLength) score += 1;
  if (hasUppercase && hasLowercase) score += 1;
  if (hasNumber) score += 1;
  if (hasSpecial && password.length >= 8) score += 1;

  const labels = ['Too Short', 'Weak', 'Fair', 'Good', 'Strong'];
  const label = labels[score] || 'Weak';

  return {
    score,
    label,
    hasMinLength,
    hasUppercase,
    hasLowercase,
    hasNumber,
    hasSpecial,
  };
};
