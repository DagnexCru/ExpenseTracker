/**
 * @file currencies.js
 * @description Centralized supported currencies configuration for SpendWise
 */

export const SUPPORTED_CURRENCIES = [
  { code: 'ETB', name: 'Ethiopian Birr', symbol: 'Br', flag: '🇪🇹', isDefault: true },
  { code: 'USD', name: 'United States Dollar', symbol: '$', flag: '🇺🇸', isDefault: false },
  { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺', isDefault: false },
  { code: 'GBP', name: 'British Pound Sterling', symbol: '£', flag: '🇬🇧', isDefault: false },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'CA$', flag: '🇨🇦', isDefault: false },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', flag: '🇦🇺', isDefault: false },
  { code: 'KES', name: 'Kenyan Shilling', symbol: 'KSh', flag: '🇰🇪', isDefault: false },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', flag: '🇯🇵', isDefault: false },
];

export const SUPPORTED_CURRENCY_CODES = SUPPORTED_CURRENCIES.map((c) => c.code);

export const DEFAULT_CURRENCY = 'ETB';

/**
 * Check if a currency code is supported
 * @param {string} code
 * @returns {boolean}
 */
export const isSupportedCurrency = (code) => {
  if (!code || typeof code !== 'string') return false;
  return SUPPORTED_CURRENCY_CODES.includes(code.toUpperCase());
};

export default {
  SUPPORTED_CURRENCIES,
  SUPPORTED_CURRENCY_CODES,
  DEFAULT_CURRENCY,
  isSupportedCurrency,
};
