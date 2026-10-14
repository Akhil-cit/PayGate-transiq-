import axios from 'axios';

export const getApiBaseUrl = () => {
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  if (typeof window !== 'undefined' && window.location && window.location.hostname) {
    const protocol = window.location.protocol || 'http:';
    const hostname = window.location.hostname;
    
    if (hostname.includes('-5173')) {
      const backendHostname = hostname.replace('-5173', '-5000');
      return `${protocol}//${backendHostname}/api`;
    }
    
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return `${protocol}//${hostname}:5000/api`;
    }

    if (/^\d+\.\d+\.\d+\.\d+$/.test(hostname)) {
      return `${protocol}//${hostname}:5000/api`;
    }
    
    return '/api';
  }
  return 'http://localhost:5000/api';
};

const api = axios.create({
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(
  (config) => {
    config.baseURL = getApiBaseUrl();
    const token = localStorage.getItem('paygate_token');
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
    if (error.response?.status === 401) {
      console.warn('⚠️ 401 Unauthorized: Invalid or missing token. Redirecting to login...');
      localStorage.removeItem('paygate_token');
      localStorage.removeItem('paygate_user');
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
        const isAdmin = window.location.pathname.startsWith('/admin');
        window.location.href = isAdmin ? '/admin/login' : '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
