import client from './client.js';

/**
 * Dashboard API client methods
 */

/**
 * Fetch overall dashboard summary metrics (Net balance, Income, Expenses, Savings rate, Recent transactions)
 * @param {Object} params
 * @param {string} [params.startDate]
 * @param {string} [params.endDate]
 */
export const fetchDashboardSummary = async (params = {}) => {
  const response = await client.get('/dashboard/summary', { params });
  return response.data;
};

/**
 * Fetch monthly trends for Income vs Expenses chart
 * @param {Object} params
 * @param {number} [params.year]
 * @param {number} [params.months]
 */
export const fetchMonthlyTrend = async (params = {}) => {
  const response = await client.get('/dashboard/monthly', { params });
  return response.data;
};

/**
 * Fetch category breakdown for donut/pie charts
 * @param {Object} params
 * @param {'expense'|'income'} [params.type='expense']
 * @param {string} [params.startDate]
 * @param {string} [params.endDate]
 */
export const fetchCategoryBreakdown = async (params = {}) => {
  const response = await client.get('/dashboard/categories', { params });
  return response.data;
};

export default {
  fetchDashboardSummary,
  fetchMonthlyTrend,
  fetchCategoryBreakdown,
};
