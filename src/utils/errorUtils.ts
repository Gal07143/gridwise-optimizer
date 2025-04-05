
import { toast } from 'sonner';

/**
 * Handles API errors in a standardized way
 */
export const handleApiError = (error: any, message: string = "An error occurred"): Error => {
  console.error("API Error:", error);
  
  let errorMessage = message;
  
  if (error?.message) {
    errorMessage = error.message;
  }
  
  // For Supabase errors
  if (error?.error_description) {
    errorMessage = error.error_description;
  }
  
  toast.error(errorMessage);
  return new Error(errorMessage);
};

/**
 * Check if an error is a network error
 */
export const isNetworkError = (error: any): boolean => {
  return (
    error?.message?.includes('network') ||
    error?.message?.includes('Failed to fetch') ||
    error?.message?.includes('Network Error') ||
    error?.message?.includes('NetworkError') ||
    error?.name === 'TypeError' && navigator.onLine === false
  );
};

/**
 * Retry a function with exponential backoff
 */
export const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  initialDelay: number = 1000,
  maxDelay: number = 10000
): Promise<T> => {
  let retries = 0;
  let delay = initialDelay;
  
  // eslint-disable-next-line no-constant-condition
  while (true) {
    try {
      return await fn();
    } catch (error) {
      retries++;
      
      if (retries >= maxRetries || !isNetworkError(error)) {
        throw error;
      }
      
      console.log(`Attempt ${retries}/${maxRetries} failed. Retrying in ${delay}ms...`);
      
      await new Promise(resolve => setTimeout(resolve, delay));
      
      // Exponential backoff with a cap
      delay = Math.min(delay * 2, maxDelay);
    }
  }
};

/**
 * Handles dependency loading errors
 */
export const handleDependencyError = (
  error: Error,
  component: string,
  dependency: string
): void => {
  console.error(`Error loading dependency ${dependency} for component ${component}:`, error);
  toast.error(`Failed to load ${dependency}. Some features may not work correctly.`);
};

export default {
  handleApiError,
  isNetworkError,
  retryWithBackoff,
  handleDependencyError
};
