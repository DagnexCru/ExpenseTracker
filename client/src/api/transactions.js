/**
 * @file transactions.js
 * @description Axios API client for Transaction CRUD operations
 */

import client from './client.js';

/**
 * Fetch all transactions for the authenticated user
 * @param {Object} [params] - { type, category }
 * @returns {Promise<Object>}
 */
export const getTransactionsApi = async (params = {}) => {
  const response = await client.get('/transactions', { params });
  return response.data;
};

/**
 * Fetch a single transaction by ID
 * @param {string} id
 * @returns {Promise<Object>}
 */
export const getTransactionByIdApi = async (id) => {
  const response = await client.get(`/transactions/${id}`);
  return response.data;
};

/**
 * Create a new transaction
 * @param {Object} data - { type, amount, category, date, description, paymentMethod }
 * @returns {Promise<Object>}
 */
export const createTransactionApi = async (data) => {
  const response = await client.post('/transactions', data);
  return response.data;
};

/**
 * Update an existing transaction
 * @param {string} id
 * @param {Object} data - updated fields
 * @returns {Promise<Object>}
 */
export const updateTransactionApi = async (id, data) => {
  const response = await client.put(`/transactions/${id}`, data);
  return response.data;
};

/**
 * Delete a transaction by ID
 * @param {string} id
 * @returns {Promise<Object>}
 */
export const deleteTransactionApi = async (id) => {
  const response = await client.delete(`/transactions/${id}`);
  return response.data;
};

export default {
  getTransactionsApi,
  getTransactionByIdApi,
  createTransactionApi,
  updateTransactionApi,
  deleteTransactionApi,
};
