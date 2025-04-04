
import { toast } from 'sonner';
import { attemptDependencyReinstall } from './dependencyUtils';
import { handleError } from './errorUtils';

// Map to track attempted fixes to avoid infinite loops
const attemptedFixes = new Map<string, number>();
const MAX_FIX_ATTEMPTS = 3;

/**
 * Extract package name from error message
 */
function extractPackageName(errorMessage: string): string | null {
  const patterns = [
    /Error: Cannot find module ['"]([^'"]+)['"]/,
    /Failed to resolve ['"]([^'"]+)['"]/,
    /installing package ['"]([^'"]+)['"]/,
    /Error loading ['"]([^'"]+)['"]/,
    /['"]([^'"]+)['"] is not installed/
  ];

  for (const pattern of patterns) {
    const match = errorMessage.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

/**
 * Determine if error is likely a dependency issue
 */
function isDependencyError(error: unknown): boolean {
  if (!error) return false;
  
  const errorMessage = error instanceof Error 
    ? error.message 
    : String(error);
  
  return /cannot find module|failed to resolve|not installed|installing package|dependency|module not found/i.test(errorMessage);
}

/**
 * Global error handler for dependency errors
 */
export function setupGlobalErrorHandler() {
  const originalWindowOnError = window.onerror;
  
  window.onerror = async function(message, source, lineno, colno, error) {
    // Call original handler if exists
    if (originalWindowOnError) {
      originalWindowOnError.call(window, message, source, lineno, colno, error);
    }
    
    // Check if this is likely a dependency error
    const errorMessage = String(message);
    if (isDependencyError(errorMessage) || isDependencyError(error)) {
      console.warn('Dependency error detected:', errorMessage);
      
      // Try to extract package name
      const packageName = extractPackageName(errorMessage);
      
      if (packageName) {
        // Check if we've already tried to fix this package too many times
        const attempts = attemptedFixes.get(packageName) || 0;
        
        if (attempts < MAX_FIX_ATTEMPTS) {
          attemptedFixes.set(packageName, attempts + 1);
          
          toast.loading(`Attempting to fix dependency issue with ${packageName}...`, {
            id: `fix-${packageName}`,
            duration: 3000
          });
          
          const success = await attemptDependencyReinstall(packageName);
          
          if (success) {
            toast.success(`Fixed issue with ${packageName}. Reloading...`, {
              id: `fix-${packageName}`
            });
            // Reload the page after a brief delay
            setTimeout(() => window.location.reload(), 1500);
          } else {
            toast.error(`Failed to fix issue with ${packageName}. Try refreshing the page.`, {
              id: `fix-${packageName}`
            });
          }
        } else {
          toast.error(`Multiple fix attempts for ${packageName} have failed. Please check your installation manually.`);
        }
      } else {
        // Generic dependency error handling when we can't extract the package name
        handleError(error || new Error(errorMessage), 'loading module');
      }
      
      return true; // Prevents the default error handler
    }
    
    return false; // Let other errors propagate to default handler
  };

  // Also handle unhandled promise rejections
  window.addEventListener('unhandledrejection', async (event) => {
    const error = event.reason;
    if (isDependencyError(error)) {
      event.preventDefault(); // Prevent default handling
      
      const errorMessage = error instanceof Error ? error.message : String(error);
      const packageName = extractPackageName(errorMessage);
      
      if (packageName) {
        const attempts = attemptedFixes.get(packageName) || 0;
        if (attempts < MAX_FIX_ATTEMPTS) {
          attemptedFixes.set(packageName, attempts + 1);
          await attemptDependencyReinstall(packageName);
        }
      }
    }
  });

  console.log('Global error handler for dependencies installed');
}

// Reset the fix attempts tracking
export function resetFixAttempts() {
  attemptedFixes.clear();
}
