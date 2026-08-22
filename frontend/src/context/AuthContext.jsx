import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/auth';
import { CURRENT_USER } from '../data/usersData';

const AuthContext = createContext(null);

const USER_STORAGE_KEY = 'globetrotter_user_profile';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(USER_STORAGE_KEY);
      if (stored) {
        return { ...CURRENT_USER, ...JSON.parse(stored) };
      }
    } catch (e) {
      console.warn('Could not load user from localStorage:', e);
    }
    return CURRENT_USER;
  });
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
      }
    } catch (e) {
      console.warn('Could not persist user to localStorage:', e);
    }
  }, [user]);


  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const res = await authApi.login(email, password);
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
      setUser(res.user);
      setIsAuthenticated(true);
      return res;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await authApi.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateUserProfile = (updatedData) => {
    setUser((prev) => ({ ...prev, ...updatedData }));
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
