
/**
 * Utility functions for error handling
 */

/**
 * Checks if an error is a network-related error
 */
export function isNetworkError(error: any): boolean {
  if (!error) return false;
  
  // Check for common network error conditions
  if (error.message && (
    error.message.includes('network') || 
    error.message.includes('connection') ||
    error.message.includes('offline') ||
    error.message.includes('unreachable') ||
    error.message.includes('timeout')
  )) {
    return true;
  }
  
  // Check for HTTP status codes that indicate network issues
  if (error.status === 0 || error.status === 408 || error.status === 502 || 
      error.status === 503 || error.status === 504) {
    return true;
  }
  
  return false;
}

/**
 * Retry a function with exponential backoff
 * @param fn Function to retry
 * @param maxRetries Maximum number of retries
 * @param delay Initial delay in ms
 * @param backoffRate Rate at which to increase delay (e.g., 2 will double delay each retry)
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000,
  backoffRate: number = 2
): Promise<T> {
  let retries = 0;
  let currentDelay = delay;
  
  while (true) {
    try {
      return await fn();
    } catch (error) {
      retries++;
      
      if (retries >= maxRetries) {
        throw error;
      }
      
      console.log(`Attempt ${retries} failed, retrying in ${currentDelay}ms`);
      
      // Wait for the current delay
      await new Promise(resolve => setTimeout(resolve, currentDelay));
      
      // Increase the delay for the next retry
      currentDelay *= backoffRate;
    }
  }
}

/**
 * Handle API errors with appropriate feedback
 */
export function handleApiError(error: any, context: string, showToast: boolean = true): void {
  console.error(`API Error in ${context}:`, error);
  
  if (showToast) {
    // You might want to import toast from 'sonner' here
    // toast.error(`Error: ${error.message || 'Unknown error occurred'}`);
    console.error(`Error: ${error.message || 'Unknown error occurred'}`);
  }
}

/**
 * Handle dependency errors in components
 */
export function handleDependencyError(error: Error, componentName: string, dependency: string): void {
  console.error(`Error in ${componentName} with dependency ${dependency}:`, error);
  // Additional logic for handling dependency errors
}

export default {
  isNetworkError,
  retryWithBackoff,
  handleApiError,
  handleDependencyError
};
