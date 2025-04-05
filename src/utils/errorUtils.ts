
/**
 * Handler for dependency errors in components
 */
export const handleDependencyError = (
  error: Error,
  componentName: string,
  dependencyName: string
) => {
  console.error(
    `Error loading dependency ${dependencyName} in ${componentName}:`,
    error
  );
  return {
    message: `Failed to load ${dependencyName}`,
    componentName,
    error,
  };
};

/**
 * Handler for API errors
 */
export const handleApiError = (
  error: any,
  serviceName: string,
  operation: string
) => {
  const errorMessage = error?.response?.data?.message || error?.message || 'Unknown error';
  
  console.error(`API Error in ${serviceName} during ${operation}:`, error);
  
  return {
    message: errorMessage,
    service: serviceName,
    operation,
    originalError: error,
    timestamp: new Date().toISOString(),
  };
};

/**
 * Check if an error is a network error
 */
export const isNetworkError = (error: any): boolean => {
  return (
    error?.message?.includes('Network Error') ||
    error?.message?.includes('Failed to fetch') ||
    error?.message?.includes('Network request failed') ||
    error?.code === 'ECONNABORTED' ||
    error?.code === 'ERR_NETWORK' ||
    (!navigator.onLine && error)
  );
};

/**
 * Retry a function with exponential backoff
 */
export const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  initialDelay: number = 1000,
  factor: number = 2
): Promise<T> => {
  let retries = 0;
  let delay = initialDelay;

  while (true) {
    try {
      return await fn();
    } catch (error) {
      retries += 1;
      if (retries >= maxRetries) {
        throw error; // Max retries reached, rethrow the error
      }
      
      // Wait for the specified delay
      await new Promise(resolve => setTimeout(resolve, delay));
      
      // Increase the delay for the next retry
      delay *= factor;
    }
  }
};

// Export all functions as both named exports and default export
export default {
  handleDependencyError,
  handleApiError,
  isNetworkError,
  retryWithBackoff
};
