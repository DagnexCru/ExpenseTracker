/**
 * @file user_fixtures.js
 * @description Standardized user payloads for auth integration test suites
 */

export const validUserPayload = {
  name: 'Abebe Bikila',
  email: 'abebe.test@spendwise.et',
  password: 'Password123!',
  currency: 'ETB',
};

export const alternateUserPayload = {
  name: 'Sara Connor',
  email: 'sara.connor@spendwise.org',
  password: 'Terminator2026!',
  currency: 'USD',
};

export const invalidUserPayloads = {
  missingName: {
    email: 'noname@spendwise.et',
    password: 'Password123!',
  },
  shortName: {
    name: 'A',
    email: 'shortname@spendwise.et',
    password: 'Password123!',
  },
  longName: {
    name: 'A'.repeat(55),
    email: 'longname@spendwise.et',
    password: 'Password123!',
  },
  invalidEmail: {
    name: 'Valid Name',
    email: 'invalid-email-format',
    password: 'Password123!',
  },
  shortPassword: {
    name: 'Valid Name',
    email: 'shortpass@spendwise.et',
    password: '123',
  },
  invalidCurrency: {
    name: 'Valid Name',
    email: 'badcurr@spendwise.et',
    password: 'Password123!',
    currency: 'INVALID',
  },
};
