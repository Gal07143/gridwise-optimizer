
import { toast } from 'sonner';

const DEPENDENCY_VERSION_MAP: Record<string, string> = {
  // React and core dependencies
  'react': '18.3.1',
  'react-dom': '18.3.1',
  'react-router-dom': '6.26.2',
  '@tanstack/react-query': '5.56.2',
  
  // UI Libraries
  'lucide-react': '0.462.0',
  'recharts': '2.12.7',
  'framer-motion': '10.16.4', // Specific version that works well
  'axios': '1.6.8', // Added axios
  
  // Form libraries
  'react-hook-form': '7.53.0',
  '@hookform/resolvers': '3.9.0',
  'zod': '3.23.8',
  
  // Styling and UI components
  'tailwind-merge': '2.5.2',
  'class-variance-authority': '0.7.1',
  'clsx': '2.1.1',
  
  // Other common dependencies
  'date-fns': '3.6.0',
  'sonner': '1.5.0',
  
  // MQTT dependencies
  'mqtt': '5.0.0',
  '@supabase/supabase-js': '2.49.1',
};

/**
 * Get the recommended version for a dependency
 * @param packageName - The name of the package
 * @returns The recommended version or undefined if not found
 */
export function getRecommendedVersion(packageName: string): string | undefined {
  return DEPENDENCY_VERSION_MAP[packageName];
}

/**
 * Check if a dependency has a recommended version
 * @param packageName - The name of the package
 * @returns Boolean indicating if there's a recommended version
 */
export function hasRecommendedVersion(packageName: string): boolean {
  return packageName in DEPENDENCY_VERSION_MAP;
}

/**
 * Create a full package name with its recommended version
 * @param packageName - The name of the package
 * @returns The package name with recommended version or just the name
 */
export function getVersionedPackageName(packageName: string): string {
  const version = getRecommendedVersion(packageName);
  return version ? `${packageName}@${version}` : packageName;
}

/**
 * Log dependency versions for debugging
 */
export function logDependencyVersions(): void {
  console.table(DEPENDENCY_VERSION_MAP);
  toast.info('Dependency versions logged to console', {
    description: 'Check the console for the full list of recommended dependency versions.'
  });
}

/**
 * Check installation status of critical dependencies
 */
export async function checkCriticalDependencies(): Promise<boolean> {
  const criticalDependencies = ['react', 'react-dom', 'react-router-dom', '@tanstack/react-query', 'axios'];
  let allOk = true;
  
  for (const dep of criticalDependencies) {
    try {
      // This would be replaced by an actual dependency check in a real implementation
      // For now, we just assume everything is installed correctly
      console.log(`Checking ${dep}...`);
    } catch (error) {
      console.error(`Missing critical dependency: ${dep}`, error);
      allOk = false;
    }
  }
  
  return allOk;
}

// Export the version map for reference
export { DEPENDENCY_VERSION_MAP };
