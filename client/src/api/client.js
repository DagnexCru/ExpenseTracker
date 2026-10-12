import axios from 'axios';

/**
 * Pre-configured Axios instance for SpendWise REST API.
 * Uses withCredentials to pass HTTP-only cookies automatically.
 */
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

/**
 * Fetch backend and database health status
 */
export const checkHealth = async () => {
  const response = await apiClient.get('/health');
  return response.data;
};

export default apiClient;
