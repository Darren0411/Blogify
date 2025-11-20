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
    console.error('Response error:', error.response?.status, error.response?.data);
    
    // ✅ FIXED: Only redirect to login for protected routes
    // Don't redirect if user is just browsing public pages
    const protectedRoutes = ['/add-blog', '/my-blogs', '/saved-blogs'];
    const currentPath = window.location.pathname;
    const isProtectedRoute = protectedRoutes.some(route => currentPath.startsWith(route));
    
    // Only redirect if:
    // 1. It's a 401 error
    // 2. User is trying to access a protected route
    // 3. User is not already on login page
    if (error.response?.status === 401 && isProtectedRoute && currentPath !== '/login') {
      console.log('🔒 Redirecting to login - Protected route accessed without auth');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export default api;