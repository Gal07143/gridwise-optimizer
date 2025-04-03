
import { toast } from 'sonner';
import { formatUUID } from '@/utils/uuid';

export type ApiErrorType = 
  | 'network'
  | 'authentication'
  | 'authorization'
  | 'not_found'
  | 'validation'
  | 'server'
  | 'timeout'
  | 'rate_limit'
  | 'unknown';

export interface ApiErrorOptions {
  showToast?: boolean;
  toastDuration?: number;
  context?: string;
  retry?: () => Promise<any>;
  suppressCodes?: number[];
  logLevel?: 'error' | 'warn' | 'info';
}

export interface ApiErrorDetails {
  type: ApiErrorType;
  message: string;
  code?: string | number;
  details?: any;
  status?: number;
}

/**
 * Handles API errors with consistent error reporting and user feedback
 */
export function handleApiError(
  error: any,
  options: ApiErrorOptions = { 
    showToast: true, 
    toastDuration: 5000,
    logLevel: 'error'
  }
): ApiErrorType {
  const errorDetails = getErrorDetails(error, options);
  const { type, message, code, status, details } = errorDetails;
  
  // Log the error according to the specified log level
  const logContext = options.context ? ` (${options.context})` : '';
  const logMethod = options.logLevel || 'error';
  
  if (logMethod === 'error') {
    console.error(`API Error${logContext}:`, {
      type,
      message,
      code,
      status,
      details,
      originalError: error
    });
  } else if (logMethod === 'warn') {
    console.warn(`API Warning${logContext}:`, {
      type,
      message,
      code,
      status,
      details,
      originalError: error
    });
  } else {
    console.info(`API Info${logContext}:`, {
      type,
      message,
      code,
      status,
      details,
      originalError: error
    });
  }
  
  // Check if we should suppress toast for this error code
  const shouldSuppressToast = options.suppressCodes?.includes(status || -1);
  
  // Show error toast if requested and not suppressed
  if (options.showToast && !shouldSuppressToast) {
    // If retry function provided, show with retry button
    if (options.retry) {
      toast.error(message, {
        duration: options.toastDuration,
        action: {
          label: 'Retry',
          onClick: () => options.retry?.(),
        },
      });
    } else {
      toast.error(message, {
        duration: options.toastDuration,
      });
    }
  }
  
  return type;
}

/**
 * Extract standardized error details from various error formats
 */
function getErrorDetails(error: any, options: ApiErrorOptions): ApiErrorDetails {
  // Default error details
  let details: ApiErrorDetails = {
    type: 'unknown',
    message: 'An unexpected error occurred',
    details: error
  };
  
  // Handle network connectivity issues
  if (!navigator.onLine) {
    details = {
      type: 'network',
      message: 'You are offline. Please check your internet connection.',
      code: 'OFFLINE'
    };
  } 
  // Handle timeout errors
  else if (error?.name === 'TimeoutError' || error?.message?.includes('timeout')) {
    details = {
      type: 'timeout',
      message: 'Request timed out. Please try again.',
      code: 'TIMEOUT'
    };
  }
  // Handle HTTP error responses
  else if (error?.response) {
    const status = error.response.status;
    details.status = status;
    
    // Handle specific status codes
    if (status === 401) {
      details = {
        type: 'authentication',
        message: 'You need to sign in to access this resource',
        status,
        code: 'UNAUTHORIZED'
      };
    } else if (status === 403) {
      details = {
        type: 'authorization',
        message: 'You do not have permission to perform this action',
        status,
        code: 'FORBIDDEN'
      };
    } else if (status === 404) {
      details = {
        type: 'not_found',
        message: 'The requested resource was not found',
        status,
        code: 'NOT_FOUND'
      };
    } else if (status === 422 || status === 400) {
      details = {
        type: 'validation',
        message: 'Invalid data provided',
        status,
        code: 'VALIDATION_ERROR'
      };
      
      // Try to extract validation errors from response
      const validationErrors = error.response.data?.errors || error.response.data?.message;
      if (validationErrors) {
        if (typeof validationErrors === 'string') {
          details.message = validationErrors;
          details.details = { message: validationErrors };
        } else if (Array.isArray(validationErrors)) {
          details.message = validationErrors.join(', ');
          details.details = { errors: validationErrors };
        } else if (typeof validationErrors === 'object') {
          details.message = Object.values(validationErrors).join(', ');
          details.details = validationErrors;
        }
      }
    } else if (status === 429) {
      details = {
        type: 'rate_limit',
        message: 'Too many requests. Please try again later.',
        status,
        code: 'RATE_LIMITED'
      };
    } else if (status >= 500) {
      details = {
        type: 'server',
        message: 'Server error. Our team has been notified.',
        status,
        code: `SERVER_ERROR_${status}`
      };
    }
    
    // If we have data in the response, add it to details
    if (error.response.data) {
      details.details = error.response.data;
      
      // Override message if we have a better one from the server
      if (typeof error.response.data.message === 'string') {
        details.message = error.response.data.message;
      } else if (typeof error.response.data.error === 'string') {
        details.message = error.response.data.error;
      }
    }
  } 
  // Handle network errors (no response received)
  else if (error?.request) {
    details = {
      type: 'network',
      message: 'Network error. Please check your connection and try again.',
      code: 'NETWORK_ERROR'
    };
  } 
  // Handle errors with recognizable messages
  else if (error?.message) {
    details.message = error.message;
    
    if (error.message.includes('Network') || error.message.includes('net::ERR')) {
      details.type = 'network';
      details.message = 'Network error. Please check your connection and try again.';
      details.code = 'NETWORK_ERROR';
    }
  }
  
  // Context-specific error messages if provided
  if (options.context) {
    // Customize error message based on context
    const contextPart = options.context.toLowerCase();
    if (contextPart.includes('login') || contextPart.includes('auth')) {
      if (details.type === 'authentication') {
        details.message = 'Invalid login credentials. Please try again.';
      } else if (details.type === 'network') {
        details.message = 'Unable to connect to authentication service. Please try again later.';
      }
    } else if (contextPart.includes('device') && details.type === 'not_found') {
      details.message = 'The requested device was not found or may have been removed.';
    } else if (contextPart.includes('telemetry') && details.type === 'timeout') {
      details.message = 'Telemetry data retrieval timed out. The device may be offline.';
    }
  }
  
  return details;
}

/**
 * Format UUID strings in requests to prevent common issues
 */
export function formatUuid(uuid: string | null | undefined): string | null {
  return formatUUID(uuid);
}

// Export a combined API error service
export const apiErrorService = {
  handleError: handleApiError,
  formatUuid,
};
