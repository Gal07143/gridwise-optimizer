
/**
 * This utility handles global errors in the application,
 * particularly React refresh errors
 */

export const setupGlobalErrorHandler = (): void => {
  // Previous error handler
  const originalOnError = window.onerror;

  // Override the default error handler
  window.onerror = (message, source, line, column, error) => {
    // Check for React refresh errors
    if (message && typeof message === 'string' && 
        message.includes('React refresh') || 
        message.includes('React Refresh')) {
      
      console.error('React refresh error detected:', message);
      console.info('Attempting to recover - you may need to manually refresh the page');
      
      // Attempt recovery by reloading modules
      try {
        // @ts-ignore - This is a Vite-specific property
        if (import.meta.hot) {
          // @ts-ignore
          import.meta.hot.invalidate();
        }
      } catch (e) {
        console.error('Failed auto-recovery:', e);
      }
    }
    
    // Call the original handler
    if (originalOnError) {
      return originalOnError(message, source, line, column, error);
    }
    
    return false;
  };
};
