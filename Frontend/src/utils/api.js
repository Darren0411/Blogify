import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4500';

console.log('🌐 API Base URL:', API_BASE_URL);

// Create axios instance with credentials enabled
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,  // ✅ CRITICAL: Send cookies with every request
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log('📤 Request:', config.method.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => {
    console.log('📥 Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('❌ Response error:', error.response?.status, error.response?.data);
    
    // If 401, redirect to login
    if (error.response?.status === 401 && window.location.pathname !== '/login') {
      console.log('🔐 Unauthorized - Redirecting to login');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export default api;
