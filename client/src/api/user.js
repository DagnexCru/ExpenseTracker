/**
 * @file user.js
 * @description API client methods for User Profile and Preferences
 */

import client from './client.js';

/**
 * Fetch current authenticated user profile
 * @returns {Promise<Object>}
 */
export const getUserProfileApi = async () => {
  const response = await client.get('/users/me');
  return response.data;
};

/**
 * Update current authenticated user profile
 * @param {Object} data - { name?: string, currency?: string }
 * @returns {Promise<Object>}
 */
export const updateUserProfileApi = async (data) => {
  const response = await client.patch('/users/me', data);
  return response.data;
};

export default {
  getUserProfileApi,
  updateUserProfileApi,
};
