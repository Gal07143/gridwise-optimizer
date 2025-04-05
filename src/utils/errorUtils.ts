
import { toast } from 'sonner';

/**
 * Utility function to handle API errors consistently
 */
export const handleApiError = (error: Error | unknown, context = 'API'): Error => {
  const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
  console.error(`${context} Error:`, error);
  toast.error(`${context} Error: ${errorMessage}`);
  return error instanceof Error ? error : new Error(errorMessage);
};

/**
 * Utility function to handle dependency errors
 */
export const handleDependencyError = (
  error: Error | unknown, 
  fallback: React.ReactNode, 
  dependencyName: string
): { error: Error; fallback: React.ReactNode } => {
  const errorMessage = error instanceof Error ? error.message : 'An unknown dependency error occurred';
  console.error(`${dependencyName} Dependency Error:`, error);
  return {
    error: error instanceof Error ? error : new Error(errorMessage),
    fallback
  };
};

/**
 * Function to safely stringify objects for error messages
 */
export const safeStringify = (obj: any): string => {
  try {
    return JSON.stringify(obj);
  } catch (error) {
    return '[Object cannot be stringified]';
  }
};

export default {
  handleApiError,
  handleDependencyError,
  safeStringify
};
