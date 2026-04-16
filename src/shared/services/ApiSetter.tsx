import axios from "axios";
const rawApiUrl = import.meta.env.VITE_API_URL;
const API_BASE_URL =rawApiUrl;

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const response = error.response;

    if (response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }

    if (response?.data && typeof response.data === 'string' && response.data.includes('<html')) {
      error.response.data = {
        message: response.statusText || 'Server returned an unexpected response.',
      };
    }

    if (!response) {
      error.message = 'Network error: could not reach the API server.';
    }

    return Promise.reject(error);
  }
);

export default api;
