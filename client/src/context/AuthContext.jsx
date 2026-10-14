import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { registerApi, loginApi, logoutApi, getMeApi, googleAuthApi } from '../api/auth';

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

  // Gracefully handle session expiration from Axios interceptors
  useEffect(() => {
    const handleSessionExpired = (event) => {
      setUser((currentUser) => {
        if (currentUser) {
          setError(event.detail?.message || 'Your session has expired. Please sign in again.');
        }
        return null;
      });
    };

    window.addEventListener('spendwise:session-expired', handleSessionExpired);
    return () => {
      window.removeEventListener('spendwise:session-expired', handleSessionExpired);
    };
  }, []);

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

  // Handle Google Single Sign-In
  const loginWithGoogle = async ({ email, name } = {}) => {
    setError(null);
    setIsLoading(true);
    try {
      const payload = {
        email: email || 'dagnew.google@spendwise.et',
        name: name || 'Dagnew Cru',
      };
      const data = await googleAuthApi(payload);
      if (data && data.data && data.data.user) {
        setUser(data.data.user);
        return { success: true, user: data.data.user };
      }
      return { success: false, message: 'Invalid response from Google auth' };
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        'Google authentication failed. Please try again.';
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

  // Synchronize updated user profile across application state
  const updateUser = useCallback((updatedUserData) => {
    setUser((prev) => (prev ? { ...prev, ...updatedUserData } : updatedUserData));
  }, []);

  const value = {
    user,
    isAuthenticated: Boolean(user),
    isLoading,
    error,
    register,
    login,
    loginWithGoogle,
    logout,
    updateUser,
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
