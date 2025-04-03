
import { toast } from 'sonner';

export type ApiErrorType = 
  | 'network'
  | 'authentication'
  | 'authorization'
  | 'not_found'
  | 'validation'
  | 'server'
  | 'unknown';

export interface ApiErrorOptions {
  showToast?: boolean;
  toastDuration?: number;
  context?: string;
  retry?: () => Promise<any>;
}

/**
 * Handles API errors with consistent error reporting and user feedback
 */
export function handleApiError(
  error: any,
  options: ApiErrorOptions = { 
    showToast: true, 
    toastDuration: 5000 
  }
): ApiErrorType {
  console.error(`API Error${options.context ? ` (${options.context})` : ''}:`, error);
  
  // Determine error type
  let errorType: ApiErrorType = 'unknown';
  let errorMessage = 'An unexpected error occurred';
  
  if (!navigator.onLine) {
    errorType = 'network';
    errorMessage = 'You are offline. Please check your internet connection.';
  } else if (error?.response) {
    // Handle HTTP error responses
    const status = error.response.status;
    
    if (status === 401) {
      errorType = 'authentication';
      errorMessage = 'You need to sign in to access this resource';
    } else if (status === 403) {
      errorType = 'authorization';
      errorMessage = 'You do not have permission to perform this action';
    } else if (status === 404) {
      errorType = 'not_found';
      errorMessage = 'The requested resource was not found';
    } else if (status === 422 || status === 400) {
      errorType = 'validation';
      errorMessage = 'Invalid data provided';
      
      // Try to extract validation errors from response
      const validationErrors = error.response.data?.errors || error.response.data?.message;
      if (validationErrors) {
        if (typeof validationErrors === 'string') {
          errorMessage = validationErrors;
        } else if (Array.isArray(validationErrors)) {
          errorMessage = validationErrors.join(', ');
        } else if (typeof validationErrors === 'object') {
          errorMessage = Object.values(validationErrors).join(', ');
        }
      }
    } else if (status >= 500) {
      errorType = 'server';
      errorMessage = 'Server error. Our team has been notified.';
    }
  } else if (error?.request) {
    // Network error (no response received)
    errorType = 'network';
    errorMessage = 'Network error. Please check your connection and try again.';
  } else if (error?.message?.includes('Network')) {
    errorType = 'network';
    errorMessage = 'Network error. Please check your connection and try again.';
  }
  
  // Show error toast if requested
  if (options.showToast) {
    // If retry function provided, show with retry button
    if (options.retry) {
      toast.error(errorMessage, {
        duration: options.toastDuration,
        action: {
          label: 'Retry',
          onClick: () => options.retry?.(),
        },
      });
    } else {
      toast.error(errorMessage, {
        duration: options.toastDuration,
      });
    }
  }
  
  return errorType;
}

/**
 * Format UUID strings in requests to prevent common issues
 */
export function formatUuid(uuid: string | null | undefined): string | null {
  if (!uuid) return null;
  
  // Remove non-alphanumeric characters
  const cleanUuid = uuid.replace(/[^a-zA-Z0-9]/g, '');
  
  // Check if it's a valid length for UUID
  if (cleanUuid.length !== 32) return null;
  
  // Format as standard UUID
  return [
    cleanUuid.substring(0, 8),
    cleanUuid.substring(8, 12),
    cleanUuid.substring(12, 16),
    cleanUuid.substring(16, 20),
    cleanUuid.substring(20, 32)
  ].join('-');
}
