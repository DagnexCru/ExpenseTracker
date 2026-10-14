/**
 * @file passwordStrength.js
 * @description Frontend password strength calculation and feedback helpers
 */

/**
 * Calculates password strength metrics for UI display.
 *
 * @param {string} password
 * @returns {{ score: number, label: string, color: string, rules: { minLength: boolean, upper: boolean, lower: boolean, number: boolean, special: boolean } }}
 */
export const getPasswordStrength = (password = '') => {
  const rules = {
    minLength: password.length >= 6,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };

  let score = 0;
  if (rules.minLength) score += 1;
  if (rules.upper && rules.lower) score += 1;
  if (rules.number) score += 1;
  if (rules.special && password.length >= 8) score += 1;

  const colorMap = {
    0: 'bg-slate-300',
    1: 'bg-rose-500',
    2: 'bg-amber-500',
    3: 'bg-blue-500',
    4: 'bg-emerald-500',
  };

  const labelMap = {
    0: 'Too Short',
    1: 'Weak',
    2: 'Fair',
    3: 'Good',
    4: 'Strong',
  };

  return {
    score,
    label: labelMap[score] || 'Weak',
    color: colorMap[score] || 'bg-rose-500',
    rules,
  };
};
