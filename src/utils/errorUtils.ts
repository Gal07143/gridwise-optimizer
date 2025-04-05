
import { toast } from 'sonner';

/**
 * Check if an error is a network-related error
 */
export const isNetworkError = (error: Error | unknown): boolean => {
  if (!error) return false;
  
  // Network errors usually have one of these messages
  const networkErrorMessages = [
    'failed to fetch',
    'network error',
    'network request failed',
    'connection refused',
    'timeout'
  ];
  
  const errorMessage = error instanceof Error ? error.message.toLowerCase() : String(error).toLowerCase();
  return networkErrorMessages.some(msg => errorMessage.includes(msg));
};

/**
 * Utility function to handle API errors consistently
 */
export const handleApiError = (error: Error | unknown, context = 'API'): Error => {
  const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
  console.error(`${context} Error:`, error);
  toast.error(`${context} Error: ${errorMessage}`);
  return error instanceof Error ? error : new Error(errorMessage);
};

/**
 * Utility function to handle dependency errors
 */
export const handleDependencyError = (
  error: Error | unknown, 
  fallback: React.ReactNode, 
  dependencyName: string
): { error: Error; fallback: React.ReactNode } => {
  const errorMessage = error instanceof Error ? error.message : 'An unknown dependency error occurred';
  console.error(`${dependencyName} Dependency Error:`, error);
  return {
    error: error instanceof Error ? error : new Error(errorMessage),
    fallback
  };
};

/**
 * Retry a function with exponential backoff
 * 
 * @param fn - The function to retry
 * @param maxRetries - Maximum number of retries
 * @param delay - Initial delay in milliseconds
 * @returns The result of the function
 */
export const retryWithBackoff = async <T>(
  fn: () => Promise<T>, 
  maxRetries = 3, 
  delay = 1000
): Promise<T> => {
  let retries = 0;
  
  const execute = async (): Promise<T> => {
    try {
      return await fn();
    } catch (err) {
      if (retries >= maxRetries) {
        throw err;
      }
      
      // Calculate backoff delay
      const backoffDelay = delay * Math.pow(2, retries);
      
      // Wait for the backoff period
      await new Promise(resolve => setTimeout(resolve, backoffDelay));
      
      // Increment retry counter and try again
      retries++;
      return execute();
    }
  };
  
  return execute();
};

/**
 * Function to safely stringify objects for error messages
 */
export const safeStringify = (obj: any): string => {
  try {
    return JSON.stringify(obj);
  } catch (error) {
    return '[Object cannot be stringified]';
  }
};

export default {
  handleApiError,
  handleDependencyError,
  isNetworkError,
  retryWithBackoff,
  safeStringify
};
