
import { toast } from 'sonner';
import { AxiosError } from 'axios';

interface ApiErrorOptions {
  context?: string;
  showToast?: boolean;
  defaultMessage?: string;
}

/**
 * Handle API errors in a consistent way
 */
export function handleApiError(
  error: unknown, 
  options: ApiErrorOptions = { showToast: true }
) {
  const {
    context = '',
    showToast = true,
    defaultMessage = 'An error occurred while fetching data'
  } = options;

  let errorMessage = defaultMessage;
  let statusCode: number | null = null;

  // Extract message from different error types
  if (error instanceof AxiosError) {
    statusCode = error.response?.status || null;
    errorMessage = error.response?.data?.message || error.message;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  } else if (typeof error === 'string') {
    errorMessage = error;
  }

  // Log the error
  console.error(
    `${context ? `[${context}] ` : ''}Error${statusCode ? ` (${statusCode})` : ''}: `, 
    errorMessage, 
    error
  );

  // Show toast notification if requested
  if (showToast) {
    toast.error(errorMessage);
  }

  return { message: errorMessage, statusCode };
}

/**
 * Handle dependency errors for specific packages
 */
export function handleDependencyError(error: Error, packageName: string): string {
  console.error(`Dependency error for ${packageName}:`, error);
  
  // Specific package error handling
  if (packageName === 'framer-motion') {
    return `Animation library failed to load. Some UI animations might not work correctly.`;
  }
  
  if (packageName === 'recharts') {
    return `Chart library failed to load. Data visualizations might not display correctly.`;
  }
  
  if (packageName === 'mqtt') {
    return `Real-time messaging service could not initialize. Live updates might be delayed.`;
  }
  
  if (packageName === '@supabase/supabase-js') {
    return `Database connection service failed. Some data might not be available.`;
  }
  
  // Generic error message for other packages
  return `A required component failed to load: ${packageName}. Some features may be unavailable.`;
}

/**
 * Format error message from various sources
 */
export function formatErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  if (typeof error === 'object' && error !== null) {
    return JSON.stringify(error);
  }
  return 'An unknown error occurred';
}

export default {
  handleApiError,
  handleDependencyError,
  formatErrorMessage
};
