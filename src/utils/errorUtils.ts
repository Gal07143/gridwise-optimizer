
import { toast } from 'sonner';

interface HandleApiErrorOptions {
  context?: string;
  showToast?: boolean;
  defaultMessage?: string;
  onError?: (error: any) => void;
}

/**
 * Generic error handler for API calls
 * 
 * @param error - The error object from a failed API call
 * @param options - Configuration options for error handling
 * @returns The formatted error message
 */
export const handleApiError = (error: any, options: HandleApiErrorOptions | string = {}): string => {
  // Allow passing a string directly as the context
  const opts: HandleApiErrorOptions = typeof options === 'string' 
    ? { context: options } 
    : options;

  const { 
    context = 'API',
    showToast = true,
    defaultMessage = 'An unexpected error occurred',
    onError 
  } = opts;

  // Extract the error message
  let errorMessage = defaultMessage;
  
  if (error) {
    if (typeof error === 'string') {
      errorMessage = error;
    } else if (error.message) {
      errorMessage = error.message;
    } else if (error.error) {
      errorMessage = typeof error.error === 'string' ? error.error : JSON.stringify(error.error);
    } else if (error.statusText) {
      errorMessage = error.statusText;
    }
  }
  
  // Format context for display
  const formattedContext = context ? `${context}: ` : '';
  const fullErrorMessage = `${formattedContext}${errorMessage}`;
  
  // Show toast notification if requested
  if (showToast) {
    toast.error(fullErrorMessage);
  }
  
  // Log the error to console
  console.error(`Error in ${context}:`, error);
  
  // Call optional error callback
  if (onError) {
    onError(error);
  }
  
  return fullErrorMessage;
};

/**
 * Format validation errors into a user-friendly message
 */
export const formatValidationErrors = (errors: Record<string, string>): string => {
  const errorList = Object.entries(errors)
    .map(([field, message]) => `• ${field}: ${message}`)
    .join('\n');
  
  return errorList;
};

/**
 * Check if an object is an error
 */
export const isError = (obj: any): obj is Error => {
  return obj instanceof Error || (typeof obj === 'object' && obj !== null && 'message' in obj);
};

/**
 * Determines if an error is related to network connectivity
 */
export const isNetworkError = (error: any): boolean => {
  if (!error) return false;
  
  // Check for common network error messages and properties
  const errorMessage = (error.message || '').toLowerCase();
  const errorString = String(error).toLowerCase();
  
  // Network-related error indicators
  const networkErrorIndicators = [
    'network error',
    'failed to fetch',
    'network request failed',
    'net::err',
    'unable to connect',
    'connection refused',
    'timeout',
    'offline',
    'cors',
    'econnaborted',
    'econnrefused',
    'econnreset',
    'enotfound'
  ];
  
  return (
    error.name === 'NetworkError' ||
    errorMessage.includes('network') ||
    networkErrorIndicators.some(indicator => 
      errorMessage.includes(indicator) || errorString.includes(indicator)
    ) ||
    error.code === 'ECONNABORTED' ||
    error.code === 'ECONNREFUSED' ||
    error.code === 'ECONNRESET' ||
    error.code === 'ENOTFOUND' ||
    error.type === 'network' ||
    (typeof navigator !== 'undefined' && !navigator.onLine)
  );
};

/**
 * Retries a promise-returning function with exponential backoff
 */
export const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  initialDelay: number = 1000,
  factor: number = 2
): Promise<T> => {
  let retries = 0;
  let delay = initialDelay;
  
  // Function to sleep for a given delay
  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  while (true) {
    try {
      return await fn();
    } catch (error) {
      retries++;
      
      if (retries > maxRetries) {
        throw error;
      }
      
      // Only retry on network errors
      if (!isNetworkError(error)) {
        throw error;
      }
      
      console.log(`Retry ${retries}/${maxRetries} after ${delay}ms...`);
      
      // Wait before retrying
      await sleep(delay);
      
      // Exponential backoff
      delay *= factor;
    }
  }
};

export default {
  handleApiError,
  formatValidationErrors,
  isError,
  isNetworkError,
  retryWithBackoff
};
