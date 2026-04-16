import axios from "axios";
const getApiBaseUrl = () => {
  // Priority 1: Vite env var (build-time)
  let url = import.meta.env.VITE_API_URL;
  if (typeof url === 'string' && url?.trim()) {
    console.log('[API] Using VITE_API_URL from Vite env:', url);
    return url.trim();
  }
  
  // Priority 2: Runtime config from generate-env-config.js (disable TS error)
  if (typeof window !== 'undefined') {
    const env = (window as any)._env_;
    if (env?.VITE_API_URL) {
      url = env.VITE_API_URL;
      if (typeof url === 'string' && url?.trim()) {
        console.log('[API] Using VITE_API_URL from runtime config:', url);
        return url.trim();
      }
    }
  }
  
  // Priority 3: Production hard fallback (user-provided)
  if (import.meta.env.PROD) {
    const fallback = 'https://tresore-commerce.andasy.dev/api';
    console.error('🚨 [API] No VITE_API_URL found in production! Using fallback:', fallback);
    console.error('💡 Set VITE_API_URL in Vercel dashboard to avoid this.');
    return fallback;
  }
  
  // Priority 4: Local dev proxy fallback
  console.log('[API] Development mode - using /api proxy');
  return '/api';
};

const API_BASE_URL = getApiBaseUrl();

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
