import apiClient from './client';

/**
 * Register a new user account
 * @param {object} payload - { name, email, password }
 * @returns {Promise<object>} response data containing user
 */
export const registerApi = async ({ name, email, password }) => {
  const response = await apiClient.post('/auth/register', {
    name,
    email,
    password,
  });
  return response.data;
};

/**
 * Authenticate existing user with credentials
 * @param {object} payload - { email, password }
 * @returns {Promise<object>} response data containing user
 */
export const loginApi = async ({ email, password }) => {
  const response = await apiClient.post('/auth/login', {
    email,
    password,
  });
  return response.data;
};

/**
 * Terminate user session and clear auth cookie
 * @returns {Promise<object>} response confirmation
 */
export const logoutApi = async () => {
  const response = await apiClient.post('/auth/logout');
  return response.data;
};

/**
 * Fetch profile of currently authenticated user via session cookie
 * @returns {Promise<object>} response data containing user
 */
export const getMeApi = async () => {
  const response = await apiClient.get('/auth/me');
  return response.data;
};

/**
 * Authenticate or register user via Google Sign-In
 * @param {object} payload - { email, name }
 * @returns {Promise<object>} response data containing user and token
 */
export const googleAuthApi = async ({ email, name }) => {
  const response = await apiClient.post('/auth/google', {
    email,
    name,
  });
  return response.data;
};

export default {
  registerApi,
  loginApi,
  logoutApi,
  getMeApi,
  googleAuthApi,
};
