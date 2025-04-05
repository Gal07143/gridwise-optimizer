
// Axios instance configuration
import { toast } from 'sonner';
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

const axiosInstance = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // You can add auth tokens here if needed
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.code === 'ECONNABORTED') {
      toast.error('Request timed out. Please try again.', {
        duration: 3000,
      });
    } else if (!error.response) {
      toast.error('Network error. Please check your connection.', {
        duration: 3000,
      });
    } else if (error?.response?.status === 401) {
      toast.error('Authorization expired. Please log in again.', {
        duration: 3000,
      });
      // Redirect to login or refresh token
    } else if (error?.response?.status === 403) {
      toast.error('You do not have permission to perform this action.', {
        duration: 3000,
      });
    } else if (error?.response?.status === 500) {
      toast.error('Server error. Please try again later.', {
        duration: 3000,
      });
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
