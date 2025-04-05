
/**
 * Check if the error is a network-related error
 * @param error Error to check
 * @returns boolean indicating if this is a network error
 */
export const isNetworkError = (error: any): boolean => {
  if (!error) return false;
  
  // Check for fetch errors
  if (error instanceof TypeError && error.message.includes('fetch')) {
    return true;
  }
  
  // Check for network-related error messages
  const networkErrorMessages = [
    'network',
    'connection',
    'timeout',
    'offline',
    'socket',
    'unreachable',
    'dns',
    'proxy'
  ];
  
  if (error.message && typeof error.message === 'string') {
    return networkErrorMessages.some(term => 
      error.message.toLowerCase().includes(term)
    );
  }
  
  return false;
};

/**
 * Convert any error to a readable message
 * @param error Error to convert
 * @returns Human-readable error message
 */
export const formatError = (error: any): string => {
  if (!error) return 'An unknown error occurred';
  
  // If it's a string, return it directly
  if (typeof error === 'string') return error;
  
  // If it's an error object with a message
  if (error.message) return error.message;
  
  // If it's a response object with a message or statusText
  if (error.data && error.data.message) return error.data.message;
  if (error.statusText) return error.statusText;
  
  // If it has nested errors, try to extract them
  if (error.error && typeof error.error === 'string') return error.error;
  if (error.error && error.error.message) return error.error.message;
  
  // Last resort, convert to string
  return String(error);
};

/**
 * Retry a function with exponential backoff
 * @param fn Function to retry
 * @param maxRetries Maximum number of retries
 * @param baseDelay Base delay in ms
 * @returns Promise that resolves to the function result or rejects after max retries
 */
export const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  baseDelay = 500
): Promise<T> => {
  let lastError: any;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      // Only retry on network errors
      if (!isNetworkError(error)) {
        throw error;
      }
      
      // Calculate backoff delay
      const delay = baseDelay * Math.pow(2, attempt);
      console.info(`Network error, retrying in ${delay}ms...`, error);
      
      // Wait for the delay
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
};

export default {
  isNetworkError,
  formatError,
  retryWithBackoff
};
