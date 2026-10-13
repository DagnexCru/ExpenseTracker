/**
 * @file user.service.js
 * @description Business logic for User profile retrieval and preference updates
 */

import User from '../models/User.js';

/**
 * Fetch public profile details for a given user ID
 *
 * @param {string} userId - Authenticated user MongoDB ID
 * @returns {Promise<Object>} User document without password
 */
export const getUserProfile = async (userId) => {
  const user = await User.findById(userId).select('-password');
  if (!user) {
    const error = new Error('User profile not found.');
    error.statusCode = 404;
    error.code = 'USER_NOT_FOUND';
    throw error;
  }
  return user;
};

/**
 * Update user display name and/or preferred currency
 *
 * @param {string} userId - Authenticated user ID
 * @param {Object} updateData - Allowed update payload ({ name, currency })
 * @returns {Promise<Object>} Updated user document without password
 */
export const updateUserProfile = async (userId, updateData = {}) => {
  const user = await User.findById(userId);
  if (!user) {
    const error = new Error('User profile not found.');
    error.statusCode = 404;
    error.code = 'USER_NOT_FOUND';
    throw error;
  }

  // Apply allowed mutations
  if (updateData.name !== undefined) {
    user.name = updateData.name;
  }

  if (updateData.currency !== undefined) {
    user.currency = updateData.currency;
  }

  await user.save();

  // Return clean JSON representation without password or internal fields
  return user.toJSON();
};

export default {
  getUserProfile,
  updateUserProfile,
};
