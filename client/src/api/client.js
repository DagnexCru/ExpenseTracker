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
 * Global response interceptor:
 * Catches 401 Unauthorized responses to notify the application of session expiration,
 * preventing broken UI states without causing endless reload loops.
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Check if error is 401 Unauthorized from a protected resource
    if (error.response && error.response.status === 401) {
      // Don't trigger session-expired for public login/register attempts
      const requestUrl = error.config?.url || '';
      const isAuthEndpoint = requestUrl.includes('/auth/login') || requestUrl.includes('/auth/register');

      if (!isAuthEndpoint && typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('spendwise:session-expired', {
            detail: {
              message: error.response.data?.message || 'Your session has expired. Please sign in again.',
              statusCode: 401,
            },
          })
        );
      }
    }

    return Promise.reject(error);
  }
);

/**
 * Fetch backend and database health status
 */
export const checkHealth = async () => {
  const response = await apiClient.get('/health');
  return response.data;
};

export default apiClient;
