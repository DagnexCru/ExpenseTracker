/**
 * @file currencies.js
 * @description Supported currencies configuration for SpendWise Client
 */

export const SUPPORTED_CURRENCIES = [
  { code: 'ETB', name: 'Ethiopian Birr', symbol: 'Br', flag: '🇪🇹', isDefault: true },
  { code: 'USD', name: 'United States Dollar', symbol: '$', flag: '🇺🇸', isDefault: false },
  { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺', isDefault: false },
  { code: 'GBP', name: 'British Pound', symbol: '£', flag: '🇬🇧', isDefault: false },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'CA$', flag: '🇨🇦', isDefault: false },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', flag: '🇦🇺', isDefault: false },
  { code: 'KES', name: 'Kenyan Shilling', symbol: 'KSh', flag: '🇰🇪', isDefault: false },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', flag: '🇯🇵', isDefault: false },
];

export const DEFAULT_CURRENCY = 'ETB';

export const SUPPORTED_CURRENCY_CODES = SUPPORTED_CURRENCIES.map((c) => c.code);

export const getCurrencySymbol = (code) => {
  const match = SUPPORTED_CURRENCIES.find((c) => c.code === code);
  return match ? match.symbol : code || 'ETB';
};

export default {
  SUPPORTED_CURRENCIES,
  SUPPORTED_CURRENCY_CODES,
  DEFAULT_CURRENCY,
  getCurrencySymbol,
};
