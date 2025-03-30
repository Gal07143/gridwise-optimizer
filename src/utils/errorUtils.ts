
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
