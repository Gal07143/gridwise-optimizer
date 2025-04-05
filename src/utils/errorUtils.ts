
/**
 * Utility to check if an error is a network error
 */
export function isNetworkError(error: unknown): boolean {
  if (error instanceof Error) {
    // Check for common network error messages
    const message = error.message.toLowerCase();
    return (
      message.includes('network') ||
      message.includes('connection') ||
      message.includes('offline') ||
      message.includes('failed to fetch') ||
      message.includes('timeout')
    );
  }
  return false;
}

/**
 * Retry a function with exponential backoff
 * 
 * @param fn Function to retry
 * @param maxRetries Maximum number of retries (default: 3)
 * @param baseDelay Base delay in ms (default: 1000)
 * @param options Additional options
 * @returns Result of the function
 */
export function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000,
  options: { showToasts?: boolean } = { showToasts: true }
): Promise<T> {
  return new Promise<T>(async (resolve, reject) => {
    let retries = 0;

    const attempt = async (): Promise<void> => {
      try {
        const result = await fn();
        resolve(result);
      } catch (error) {
        if (retries >= maxRetries) {
          reject(error);
          return;
        }

        // Calculate exponential backoff delay
        const delay = baseDelay * Math.pow(2, retries);
        
        console.log(`Retry attempt ${retries + 1}/${maxRetries} after ${delay}ms`, error);
        
        retries++;
        setTimeout(attempt, delay);
      }
    };

    attempt();
  });
}

/**
 * Format error message for display
 */
export function formatErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  } else if (typeof error === 'string') {
    return error;
  } else if (error && typeof error === 'object' && 'message' in error) {
    return String(error.message);
  }
  return 'An unknown error occurred';
}

export default {
  isNetworkError,
  retryWithBackoff,
  formatErrorMessage
};
