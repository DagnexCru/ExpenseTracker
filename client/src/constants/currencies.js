/**
 * @file currencies.js
 * @description Frontend currency definitions, symbols, and formatting options
 */

export const CURRENCIES = [
  { code: 'ETB', symbol: 'Br', name: 'Ethiopian Birr', flag: '🇪🇹' },
  { code: 'USD', symbol: '$', name: 'US Dollar', flag: '🇺🇸' },
  { code: 'EUR', symbol: '€', name: 'Euro', flag: '🇪🇺' },
  { code: 'GBP', symbol: '£', name: 'British Pound', flag: '🇬🇧' },
];

export const DEFAULT_CURRENCY_CODE = 'ETB';

export const getCurrencySymbol = (code) => {
  const found = CURRENCIES.find((c) => c.code === code);
  return found ? found.symbol : code;
};
