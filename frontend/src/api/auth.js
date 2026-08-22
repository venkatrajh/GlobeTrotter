import { CURRENT_USER } from '../data/usersData';

export const authApi = {
  login: async (email, password) => {
    await new Promise((res) => setTimeout(res, 400));
    return { success: true, user: CURRENT_USER, token: 'mock-jwt-token-12345' };
  },

  googleLogin: async () => {
    await new Promise((res) => setTimeout(res, 500));
    return { success: true, user: CURRENT_USER, token: 'mock-google-token-67890' };
  },

  signup: async (userData) => {
    await new Promise((res) => setTimeout(res, 450));
    return {
      success: true,
      user: { ...CURRENT_USER, ...userData },
      token: 'mock-jwt-token-new-user'
    };
  },

  logout: async () => {
    await new Promise((res) => setTimeout(res, 200));
    return { success: true };
  },

  getCurrentUser: async () => {
    return CURRENT_USER;
  }
};
