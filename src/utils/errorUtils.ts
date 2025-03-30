
import { toast } from 'sonner';

/**
 * Global error handler
 * @param error - The error object
 * @param context - Optional context information
 * @returns void
 */
export const handleError = (error: unknown, context: string = 'operation'): void => {
  // Log error to console with context
  console.error(`Error during ${context}:`, error);
  
  // Extract error message
  let errorMessage: string;
  
  if (error instanceof Error) {
    errorMessage = error.message;
  } else if (typeof error === 'string') {
    errorMessage = error;
  } else if (error && typeof error === 'object' && 'message' in error && typeof error.message === 'string') {
    errorMessage = error.message;
  } else {
    errorMessage = 'An unknown error occurred';
  }
  
  // Check for specific error patterns
  if (errorMessage.toLowerCase().includes('network') || 
      errorMessage.toLowerCase().includes('offline') ||
      errorMessage.toLowerCase().includes('internet')) {
    errorMessage = `Network error: Please check your connection and try again. (${errorMessage})`;
  }
  
  if (errorMessage.toLowerCase().includes('dependency') || 
      errorMessage.toLowerCase().includes('install')) {
    errorMessage = `Dependency error: Failed to install required package. Please try refreshing the page. (${errorMessage})`;
  }
  
  if (errorMessage.toLowerCase().includes('timeout') || 
      errorMessage.toLowerCase().includes('timed out')) {
    errorMessage = `Operation timed out: The server took too long to respond. Please try again later. (${errorMessage})`;
  }
  
  // Show toast notification
  toast.error(`Failed to ${context}: ${errorMessage}`);
};

/**
 * Safely parse JSON with error handling
 * @param jsonString - JSON string to parse
 * @param fallback - Optional fallback value if parsing fails
 * @returns Parsed object or fallback
 */
export function safeJsonParse<T>(jsonString: string, fallback: T): T {
  try {
    return JSON.parse(jsonString) as T;
  } catch (error) {
    console.warn('Failed to parse JSON:', error);
    return fallback;
  }
}

/**
 * Format API error message
 * @param error - Error object from API
 * @returns Formatted error message
 */
export const formatApiError = (error: unknown): string => {
  if (!error) return 'Unknown error';
  
  // Handle axios errors
  if (typeof error === 'object' && error !== null) {
    // @ts-ignore - dynamic property access
    if (error.response?.data?.message) {
      // @ts-ignore - dynamic property access
      return error.response.data.message;
    }
    
    // @ts-ignore - dynamic property access
    if (error.response?.data?.error) {
      // @ts-ignore - dynamic property access
      return error.response.data.error;
    }
    
    // Check for network errors
    // @ts-ignore - dynamic property access
    if (error.message && error.message.includes('Network Error')) {
      return 'Network error: Please check your connection and try again';
    }
    
    // @ts-ignore - dynamic property access
    if (error.message) {
      // @ts-ignore - dynamic property access
      return error.message;
    }
  }
  
  return String(error);
};

/**
 * Creates an async function wrapper that handles errors automatically
 * @param fn - Async function to wrap
 * @param errorContext - Context for error message
 * @returns Wrapped function with error handling
 */
export function withErrorHandling<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  errorContext: string
): (...args: Parameters<T>) => Promise<ReturnType<T> | null> {
  return async (...args: Parameters<T>): Promise<ReturnType<T> | null> => {
    try {
      return await fn(...args);
    } catch (error) {
      handleError(error, errorContext);
      return null;
    }
  };
}

/**
 * Retry a function multiple times with exponential backoff
 * @param fn - Async function to retry
 * @param maxRetries - Maximum number of retry attempts
 * @param retryDelay - Base delay between retries in ms
 * @returns Result of the function or throws after all retries fail
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>, 
  maxRetries: number = 3, 
  retryDelay: number = 1000
): Promise<T> {
  let lastError: unknown;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      console.warn(`Attempt ${attempt + 1}/${maxRetries} failed:`, error);
      lastError = error;
      
      // Don't delay on the last attempt
      if (attempt < maxRetries - 1) {
        const delay = retryDelay * Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError;
}

/**
 * Check if error is related to network or connectivity
 * @param error - The error to check
 * @returns Boolean indicating if it's a network error
 */
export function isNetworkError(error: unknown): boolean {
  if (!error) return false;
  
  const errorMessage = error instanceof Error 
    ? error.message 
    : typeof error === 'string' 
      ? error 
      : String(error);
  
  return /network|offline|internet|connectivity|connection|fetch|timeout/i.test(errorMessage);
}

/**
 * Handle dependency installation errors
 * @param error - The error object
 * @returns void
 */
export function handleDependencyError(error: unknown): void {
  console.error('Dependency installation error:', error);
  
  const errorMessage = error instanceof Error 
    ? error.message 
    : typeof error === 'string' 
      ? error 
      : 'Failed to install dependency';
  
  // Show more detailed error message
  toast.error(`Dependency error: ${errorMessage}`, {
    duration: 8000, // Show for longer
    action: {
      label: 'Refresh',
      onClick: () => window.location.reload(),
    },
  });
}

