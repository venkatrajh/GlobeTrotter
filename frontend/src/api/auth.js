import { apiClient } from './client';

export const authApi = {
  login: async (email, password) => {
    const res = await apiClient.post('/auth/login', { email, password });
    return { success: true, user: res.data.user, token: res.data.token };
  },

  googleLogin: async () => {
    // Optionally mock or leave unimplemented if no backend google auth
    await new Promise((res) => setTimeout(res, 500));
    return { success: true, user: { name: 'Google User', email: 'test@google.com' }, token: 'mock-google-token' };
  },

  signup: async (userData) => {
    const res = await apiClient.post('/auth/signup', {
      name: userData.name,
      email: userData.email,
      password: userData.password
    });
    return {
      success: true,
      user: res.data.user,
      token: res.data.token
    };
  },

  logout: async () => {
    // Our backend uses stateless JWTs, so we just remove token on the client side
    return { success: true };
  },

  getCurrentUser: async () => {
    const res = await apiClient.get('/users/me');
    return res.data;
  },

  updateUserProfile: async (updatedData) => {
    const res = await apiClient.put('/users/me', updatedData);
    return res.data;
  },

  deleteCurrentUser: async () => {
    const res = await apiClient.delete('/users/me');
    return res.data;
  }
};
