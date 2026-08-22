import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/auth';

const AuthContext = createContext(null);

const USER_STORAGE_KEY = 'globetrotter_user_profile';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(USER_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Could not load user from localStorage:', e);
    }
    return null; // Don't default to mock user
  });
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('globetrotter_token'));
  const [isLoading, setIsLoading] = useState(true);

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (err) {
      // Ignore logout API failure
    }
    localStorage.removeItem('globetrotter_token');
    localStorage.removeItem(USER_STORAGE_KEY);
    setUser(null);
    setIsAuthenticated(false);
  };

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('globetrotter_token');
      if (token) {
        try {
          const fetchedUser = await authApi.getCurrentUser();
          setUser(fetchedUser);
          setIsAuthenticated(true);
        } catch (e) {
          console.error("Session expired or invalid:", e);
          localStorage.removeItem('globetrotter_token');
          localStorage.removeItem(USER_STORAGE_KEY);
          setUser(null);
          setIsAuthenticated(false);
        }
      }
      setIsLoading(false);
    };
    initAuth();

    // Listen for 401s from apiClient
    const handleUnauthorized = () => {
      logout();
    };
    window.addEventListener('auth_unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth_unauthorized', handleUnauthorized);
  }, []);

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(USER_STORAGE_KEY);
      }
    } catch (e) {
      console.warn('Could not persist user to localStorage:', e);
    }
  }, [user]);

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const res = await authApi.login(email, password);
      localStorage.setItem('globetrotter_token', res.token);
      setUser(res.user);
      setIsAuthenticated(true);
      return res;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setIsLoading(true);
    try {
      const res = await authApi.googleLogin();
      localStorage.setItem('globetrotter_token', res.token);
      setUser(res.user);
      setIsAuthenticated(true);
      return res;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (userData) => {
    setIsLoading(true);
    try {
      const res = await authApi.signup(userData);
      localStorage.setItem('globetrotter_token', res.token);
      setUser(res.user);
      setIsAuthenticated(true);
      return res;
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserProfile = async (updatedData) => {
    try {
      const updatedUser = await authApi.updateUserProfile(updatedData);
      setUser(updatedUser);
      return updatedUser;
    } catch (e) {
      console.error("Failed to update profile", e);
      throw e;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        loginWithGoogle,
        signup,
        logout,
        updateUserProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
