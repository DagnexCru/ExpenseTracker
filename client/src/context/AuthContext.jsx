import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { registerApi, loginApi, logoutApi, getMeApi } from '../api/auth';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Clear any existing error message
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Check for active session cookie on initial app mount
  const checkAuthStatus = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getMeApi();
      if (data && data.success && data.data && data.data.user) {
        setUser(data.data.user);
      } else {
        setUser(null);
      }
    } catch (err) {
      // 401 just means user is not currently logged in (not an application failure)
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  // Handle User Registration
  const register = async ({ name, email, password }) => {
    setError(null);
    setIsLoading(true);
    try {
      const data = await registerApi({ name, email, password });
      if (data && data.data && data.data.user) {
        setUser(data.data.user);
        return { success: true, user: data.data.user };
      }
      return { success: false, message: 'Invalid response from server' };
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.errors?.[0]?.message ||
        err.message ||
        'Registration failed. Please try again.';
      setError(message);
      return { success: false, message };
    } finally {
      setIsLoading(false);
    }
  };

  // Handle User Login
  const login = async ({ email, password }) => {
    setError(null);
    setIsLoading(true);
    try {
      const data = await loginApi({ email, password });
      if (data && data.data && data.data.user) {
        setUser(data.data.user);
        return { success: true, user: data.data.user };
      }
      return { success: false, message: 'Invalid response from server' };
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        'Invalid email or password. Please try again.';
      setError(message);
      return { success: false, message };
    } finally {
      setIsLoading(false);
    }
  };

  // Handle User Logout
  const logout = async () => {
    setIsLoading(true);
    try {
      await logoutApi();
    } catch (err) {
      console.warn('Logout error ignored:', err.message);
    } finally {
      setUser(null);
      setError(null);
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isAuthenticated: Boolean(user),
    isLoading,
    error,
    register,
    login,
    logout,
    clearError,
    checkAuthStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
