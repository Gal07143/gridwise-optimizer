
import { toast } from "sonner";

// Types of errors
export enum ErrorType {
  VALIDATION = "validation",
  NETWORK = "network",
  AUTHENTICATION = "authentication",
  AUTHORIZATION = "authorization",
  SERVER = "server",
  UNKNOWN = "unknown"
}

// Error handler configuration
type ErrorHandlerConfig = {
  showToast?: boolean;
  logToConsole?: boolean;
};

const defaultConfig: ErrorHandlerConfig = {
  showToast: true,
  logToConsole: true
};

// Main error handling function
export const handleError = (
  error: unknown,
  errorType: ErrorType = ErrorType.UNKNOWN,
  config: ErrorHandlerConfig = defaultConfig
): string => {
  const { showToast, logToConsole } = { ...defaultConfig, ...config };
  const errorMessage = extractErrorMessage(error, errorType);
  
  if (logToConsole) {
    console.error(`[${errorType.toUpperCase()}]`, error);
  }
  
  if (showToast) {
    toast.error(errorMessage);
  }
  
  return errorMessage;
};

// Extract error message from various error types
const extractErrorMessage = (error: unknown, errorType: ErrorType): string => {
  if (error instanceof Error) {
    return error.message;
  }
  
  if (typeof error === "string") {
    return error;
  }
  
  if (typeof error === "object" && error !== null && "message" in error) {
    return String((error as { message: unknown }).message);
  }
  
  // Default error messages based on error type
  switch (errorType) {
    case ErrorType.VALIDATION:
      return "Validation error. Please check your input.";
    case ErrorType.NETWORK:
      return "Network error. Please check your connection.";
    case ErrorType.AUTHENTICATION:
      return "Authentication error. Please sign in again.";
    case ErrorType.AUTHORIZATION:
      return "You don't have permission to perform this action.";
    case ErrorType.SERVER:
      return "Server error. Please try again later.";
    default:
      return "An unknown error occurred.";
  }
};

// Handle API errors with specific handling
export const handleApiError = (error: unknown): string => {
  // Network errors
  if (error instanceof TypeError && error.message.includes("fetch")) {
    return handleError(error, ErrorType.NETWORK);
  }
  
  // Authentication errors (e.g., 401)
  if (typeof error === "object" && error !== null && "status" in error) {
    const status = (error as { status: number }).status;
    
    if (status === 401) {
      return handleError("Your session has expired. Please sign in again.", ErrorType.AUTHENTICATION);
    }
    
    if (status === 403) {
      return handleError("You don't have permission to perform this action.", ErrorType.AUTHORIZATION);
    }
    
    if (status >= 500) {
      return handleError("Server error. Please try again later.", ErrorType.SERVER);
    }
  }
  
  return handleError(error, ErrorType.UNKNOWN);
};
