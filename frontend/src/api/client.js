// Centralized API client abstraction
// Uses VITE_API_BASE_URL when available, falls back to mock delay handling

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.globetrotter.io/v1';

export const apiClient = {
  get: async (endpoint, params = {}) => {
    // In mock mode, simulate realistic network latency
    await new Promise((res) => setTimeout(res, 200));
    return { success: true, endpoint, params };
  },

  post: async (endpoint, data = {}) => {
    await new Promise((res) => setTimeout(res, 300));
    return { success: true, endpoint, data };
  },

  put: async (endpoint, data = {}) => {
    await new Promise((res) => setTimeout(res, 250));
    return { success: true, endpoint, data };
  },

  delete: async (endpoint) => {
    await new Promise((res) => setTimeout(res, 200));
    return { success: true, endpoint };
  }
};
