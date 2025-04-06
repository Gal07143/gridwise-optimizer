
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

export default {
  handleApiError,
  formatValidationErrors,
  isError
};
