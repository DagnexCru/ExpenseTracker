/**
 * @file user.validator.js
 * @description Input payload validators for User profile and preferences
 */

import { SUPPORTED_CURRENCY_CODES } from '../constants/currencies.js';

const PROTECTED_FIELDS = [
  '_id',
  'id',
  'email',
  'password',
  'passwordHash',
  'role',
  'createdAt',
  'updatedAt',
  '__v',
];

/**
 * Validates PATCH /api/users/me request payload
 * Ensures users can only update allowed profile fields (name, currency)
 * and strictly prevents mutation of protected or sensitive credentials.
 */
export const validateUpdateProfile = (req, res, next) => {
  const body = req.body || {};
  const errors = [];
  const keys = Object.keys(body);

  // 1. Ensure body is not empty
  if (keys.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: [
        {
          message: 'At least one field (name or currency) must be provided for update.',
        },
      ],
    });
  }

  // 2. Reject protected / security-sensitive fields
  for (const field of keys) {
    if (PROTECTED_FIELDS.includes(field)) {
      errors.push({
        field,
        message: `Modifying protected field "${field}" is not allowed.`,
      });
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
  }

  // 3. Ensure at least one allowed field is present
  const hasName = body.name !== undefined;
  const hasCurrency = body.currency !== undefined;
  const hasAvatar = body.avatar !== undefined;

  if (!hasName && !hasCurrency && !hasAvatar) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: [
        {
          message: 'No valid update fields provided. Only "name", "currency", or "avatar" can be updated.',
        },
      ],
    });
  }

  // 4. Validate name (if provided)
  if (hasName) {
    if (typeof body.name !== 'string') {
      errors.push({ field: 'name', message: 'Name must be a text string.' });
    } else {
      const trimmedName = body.name.trim();
      if (trimmedName.length < 2) {
        errors.push({ field: 'name', message: 'Name must be at least 2 characters long.' });
      } else if (trimmedName.length > 50) {
        errors.push({ field: 'name', message: 'Name cannot exceed 50 characters.' });
      } else {
        req.body.name = trimmedName;
      }
    }
  }

  // 5. Validate currency (if provided)
  if (hasCurrency) {
    if (typeof body.currency !== 'string') {
      errors.push({ field: 'currency', message: 'Currency must be a text string.' });
    } else {
      const code = body.currency.trim().toUpperCase();
      if (!SUPPORTED_CURRENCY_CODES.includes(code)) {
        errors.push({
          field: 'currency',
          message: `"${body.currency}" is not a supported currency. Supported: ${SUPPORTED_CURRENCY_CODES.join(', ')}.`,
        });
      } else {
        req.body.currency = code;
      }
    }
  }

  // 6. Validate avatar (if provided)
  if (hasAvatar) {
    if (body.avatar !== null && typeof body.avatar !== 'string') {
      errors.push({ field: 'avatar', message: 'Avatar must be a valid image string or null.' });
    } else {
      req.body.avatar = body.avatar;
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
  }

  next();
};

export default {
  validateUpdateProfile,
};
