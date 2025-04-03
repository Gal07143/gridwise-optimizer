
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { handleApiError, ApiErrorType } from '@/services/apiErrorHandler';
import { toast } from 'sonner';

// Configuration
const DEFAULT_TIMEOUT = 15000;
const MAX_RETRIES = 2;
const RETRY_DELAY = 1000;

// Create custom axios instance with enhanced defaults
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: DEFAULT_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Handle request retries with exponential backoff
 */
const retryHandler = async (
  error: AxiosError, 
  retryCount: number = 0
): Promise<AxiosResponse> => {
  const request = error.config as AxiosRequestConfig & { _retry?: boolean };
  
  // Don't retry if max retries reached, canceled, or not a retryable error
  if (
    !request || 
    retryCount >= MAX_RETRIES || 
    axios.isCancel(error) || 
    error.response?.status === 401 || 
    error.response?.status === 403 ||
    request._retry
  ) {
    return Promise.reject(error);
  }
  
  // Mark this request as retried
  request._retry = true;
  
  // Wait with exponential backoff before retrying
  const delay = RETRY_DELAY * Math.pow(2, retryCount);
  await new Promise(resolve => setTimeout(resolve, delay));
  
  // Add debug info
  console.log(`Retrying request to ${request.url} (attempt ${retryCount + 1}/${MAX_RETRIES})`);
  
  try {
    return await api(request);
  } catch (retryError) {
    return retryHandler(retryError as AxiosError, retryCount + 1);
  }
};

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add device information
    const appVersion = import.meta.env.VITE_APP_VERSION || '1.0.0';
    config.headers['X-Client-Info'] = `ems-dashboard/${appVersion}`;
    
    // Add request timestamp for debugging
    config.headers['X-Request-Time'] = new Date().toISOString();
    
    // Add request ID for tracing
    config.headers['X-Request-ID'] = crypto.randomUUID();
    
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
  async (error) => {
    // Don't handle errors for canceled requests
    if (axios.isCancel(error)) {
      console.log('Request canceled:', error.message);
      return Promise.reject(error);
    }

    // Attempt to retry the request if applicable
    try {
      if (error.config && !error.config._retry) {
        return await retryHandler(error);
      }
    } catch (retryError) {
      // Retry failed, continue with normal error handling
      error = retryError;
    }

    // Extract the most descriptive error message
    const errorMessage = error.response?.data?.message 
      || error.response?.data?.error 
      || error.message 
      || 'Unknown error occurred';

    // Handle API errors
    const errorType = handleApiError(error, {
      context: error.config?.url,
      showToast: true,
      retry: error.config ? () => api(error.config) : undefined
    });
    
    // Special handling for authentication errors
    if (errorType === 'authentication') {
      if (window.location.pathname !== '/login') {
        toast.error('Your session has expired. Please sign in again.');
        setTimeout(() => {
          localStorage.removeItem('auth_token');
          window.location.href = '/login';
        }, 2000);
      }
    }
    
    // Log extended error information for debugging
    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
      message: errorMessage,
      type: errorType
    });
    
    return Promise.reject(error);
  }
);

// Export individual HTTP methods with improved error handling
export const apiService = {
  get: <T = any>(url: string, config?: AxiosRequestConfig) => 
    api.get<T>(url, config).then(res => res.data),
    
  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => 
    api.post<T>(url, data, config).then(res => res.data),
    
  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => 
    api.put<T>(url, data, config).then(res => res.data),
    
  patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => 
    api.patch<T>(url, data, config).then(res => res.data),
    
  delete: <T = any>(url: string, config?: AxiosRequestConfig) => 
    api.delete<T>(url, config).then(res => res.data),
}

// Export the instance for advanced use cases
export default api;
