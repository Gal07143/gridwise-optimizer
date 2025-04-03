
import axios from 'axios';
import { handleApiError } from '@/services/apiErrorHandler';
import { toast } from 'sonner';

// Create custom axios instance with defaults
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add device information
    config.headers['X-Client-Info'] = `ems-dashboard/${import.meta.env.VITE_APP_VERSION || '1.0.0'}`;
    
    return config;
  },
  (error) => {
    // Handle request configuration errors
    console.error('Request configuration error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Don't handle errors for canceled requests
    if (axios.isCancel(error)) {
      return Promise.reject(error);
    }

    // Handle API errors
    handleApiError(error, {
      context: error.config?.url,
      showToast: true
    });
    
    // Special handling for authentication errors
    if (error.response?.status === 401) {
      // Redirect to login page if authentication fails
      if (window.location.pathname !== '/login') {
        toast.error('Your session has expired. Please sign in again.');
        setTimeout(() => {
          localStorage.removeItem('auth_token');
          window.location.href = '/login';
        }, 2000);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
