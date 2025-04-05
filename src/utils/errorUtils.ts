
/**
 * Utility functions for handling errors
 */

import { toast } from 'sonner';

/**
 * Check if an error is a network error
 */
export const isNetworkError = (error: unknown): boolean => {
  if (!error) return false;
  
  // Check for standard network error messages
  const errorMessage = error instanceof Error ? error.message : String(error);
  return (
    errorMessage.includes('Network Error') ||
    errorMessage.includes('Failed to fetch') ||
    errorMessage.includes('Network request failed') ||
    errorMessage.includes('network timeout') ||
    errorMessage.includes('ERR_CONNECTION_REFUSED') ||
    errorMessage.includes('ERR_NETWORK')
  );
};

/**
 * Retry a function with exponential backoff
 */
export const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  initialDelay = 300
): Promise<T> => {
  let retries = 0;
  
  const execute = async (): Promise<T> => {
    try {
      return await fn();
    } catch (error) {
      retries++;
      
      if (retries > maxRetries) {
        throw error;
      }
      
      const delay = initialDelay * Math.pow(2, retries - 1);
      console.log(`Retry ${retries}/${maxRetries} after ${delay}ms`);
      
      await new Promise(resolve => setTimeout(resolve, delay));
      return execute();
    }
  };
  
  return execute();
};

/**
 * Handle dependency errors
 */
export const handleDependencyError = (error: Error): void => {
  console.error('Dependency error detected:', error);
  
  // Extract package name from error if possible
  let packageName = 'unknown';
  const match = error.message.match(/(?:Cannot find module|Failed to resolve import) ['"]([^'"]+)['"]/i);
  if (match && match[1]) {
    packageName = match[1];
  }
  
  toast.error(`Dependency error: ${packageName}`, {
    description: "Please check that all required packages are installed.",
    duration: 5000,
  });
};

/**
 * Handle API errors and provide appropriate feedback
 */
export const handleApiError = (
  error: unknown, 
  options: { 
    context?: string; 
    showToast?: boolean;
    retry?: () => Promise<any>;
  } = {}
): ApiErrorType => {
  const { context = '', showToast = true, retry } = options;
  let errorType: ApiErrorType = 'unknown';
  let message = 'An unknown error occurred';
  
  if (error instanceof Error) {
    message = error.message;
    
    if (isNetworkError(error)) {
      errorType = 'network';
    } else if (message.includes('401') || message.includes('unauthorized')) {
      errorType = 'authentication';
    } else if (message.includes('403') || message.includes('forbidden')) {
      errorType = 'permission';
    } else if (message.includes('404') || message.includes('not found')) {
      errorType = 'not-found';
    } else if (message.includes('timeout')) {
      errorType = 'timeout';
    }
  }
  
  if (showToast) {
    const contextPrefix = context ? `[${context}] ` : '';
    
    const toastMessage = {
      title: `${contextPrefix}${getErrorTitle(errorType)}`,
      description: message,
    };
    
    if (errorType === 'network' || errorType === 'timeout') {
      toast.error(toastMessage.title, {
        description: toastMessage.description,
        action: retry ? {
          label: 'Retry',
          onClick: () => retry(),
        } : undefined,
      });
    } else {
      toast.error(toastMessage.title, {
        description: toastMessage.description,
      });
    }
  }
  
  return errorType;
};

/**
 * Get a user-friendly error title based on error type
 */
const getErrorTitle = (errorType: ApiErrorType): string => {
  switch (errorType) {
    case 'network':
      return 'Network Error';
    case 'authentication':
      return 'Authentication Error';
    case 'permission':
      return 'Permission Denied';
    case 'not-found':
      return 'Resource Not Found';
    case 'timeout':
      return 'Request Timeout';
    case 'validation':
      return 'Validation Error';
    case 'server':
      return 'Server Error';
    default:
      return 'Something went wrong';
  }
};

export type ApiErrorType = 
  | 'network'
  | 'authentication'
  | 'permission'
  | 'not-found'
  | 'timeout'
  | 'validation'
  | 'server'
  | 'unknown';
