
/**
 * Handler for dependency errors in components
 */
export const handleDependencyError = (
  error: Error,
  componentName: string,
  dependencyName: string
) => {
  console.error(
    `Error loading dependency ${dependencyName} in ${componentName}:`,
    error
  );
  return {
    message: `Failed to load ${dependencyName}`,
    componentName,
    error,
  };
};

/**
 * Handler for API errors
 */
export const handleApiError = (
  error: any,
  serviceName: string,
  operation: string
) => {
  const errorMessage = error?.response?.data?.message || error?.message || 'Unknown error';
  
  console.error(`API Error in ${serviceName} during ${operation}:`, error);
  
  return {
    message: errorMessage,
    service: serviceName,
    operation,
    originalError: error,
    timestamp: new Date().toISOString(),
  };
};

export default {
  handleDependencyError,
  handleApiError,
};
