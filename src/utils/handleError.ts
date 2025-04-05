
/**
 * Helper functions for error handling across the application
 */

import { toast } from 'sonner';
import { isNetworkError } from './errorUtils';

/**
 * Generic API error handler that can be used in API service functions
 */
export function handleError(error: any, context: string, silent: boolean = false): never {
  const errorMessage = error?.message || 'An unknown error occurred';
  const fullContext = `Error in ${context}: ${errorMessage}`;
  
  console.error(fullContext, error);
  
  if (!silent) {
    toast.error(errorMessage);
  }
  
  throw error;
}

/**
 * Handles API errors with context for user feedback
 * @param error The error object
 * @param context Description of where the error occurred
 * @param showToast Whether to show a toast notification
 */
export function handleApiError(error: any, context: string, showToast = true): void {
  const isNetwork = isNetworkError(error);
  const message = isNetwork
    ? 'Network error. Please check your connection and try again.'
    : error?.message || 'An unknown error occurred';

  console.error(`API Error in ${context}:`, error);
  
  if (showToast) {
    toast.error(message);
  }
}

/**
 * Handle dependency errors in components
 */
export function handleDependencyError(error: Error, componentName: string, dependency: string): void {
  console.error(`Error in ${componentName} with dependency ${dependency}:`, error);
  // Log the error to monitoring service or show a user-friendly message
  toast.error(`Component ${componentName} failed to load: ${error.message}`);
}
