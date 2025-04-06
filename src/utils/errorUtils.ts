
/**
 * Check if an error is a network error
 * @param error The error to check
 * @returns True if the error is a network error
 */
export const isNetworkError = (error: any): boolean => {
  if (!error) return false;
  
  // Check common network error cases
  return (
    error.message?.includes('network') ||
    error.message?.includes('Network Error') ||
    error.message?.includes('Failed to fetch') ||
    error.message?.includes('Network request failed') ||
    error.code === 'ECONNABORTED' ||
    error.code === 'ECONNREFUSED' ||
    error.code === 'ENOTFOUND' ||
    error.code === 'TIMEOUT_ERROR' ||
    (error.isAxiosError && !error.response) ||
    error.name === 'AbortError'
  );
};

/**
 * Generic error handler that logs errors and returns a user-friendly message
 * @param error The error to handle
 * @param operation The operation that caused the error (for logging)
 * @returns A user-friendly error message
 */
export const handleError = (error: any, operation: string): string => {
  console.error(`Error during ${operation}:`, error);
  
  if (isNetworkError(error)) {
    return 'Unable to connect to the server. Please check your network connection.';
  }
  
  if (error.response) {
    // Server responded with a status code outside the 2xx range
    switch (error.response.status) {
      case 401:
        return 'Authentication required. Please sign in.';
      case 403:
        return 'You do not have permission to perform this action.';
      case 404:
        return 'The requested resource was not found.';
      case 429:
        return 'Too many requests. Please try again later.';
      case 500:
        return 'An internal server error occurred. Please try again later.';
      default:
        return error.response.data?.message || 'An unexpected error occurred. Please try again.';
    }
  }
  
  return error.message || 'An unexpected error occurred. Please try again.';
};

/**
 * Handle API errors with consistent formatting
 * @param error The error to handle
 * @param operation The operation that was being performed
 * @returns A formatted error message
 */
export const handleApiError = (error: any, operation: string): string => {
  return handleError(error, operation);
};

/**
 * Retry a function with exponential backoff
 * @param fn The function to retry
 * @param retries The number of retries
 * @param delay The initial delay in milliseconds
 * @param backoff The backoff factor
 */
export const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  retries = 3,
  delay = 300,
  backoff = 2
): Promise<T> => {
  try {
    return await fn();
  } catch (error) {
    if (retries <= 0) {
      throw error;
    }
    
    await new Promise(resolve => setTimeout(resolve, delay));
    return retryWithBackoff(fn, retries - 1, delay * backoff, backoff);
  }
};
