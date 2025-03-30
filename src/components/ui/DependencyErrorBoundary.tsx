
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  isDependencyError: boolean;
}

class DependencyErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null,
      isDependencyError: false
    };
  }

  static getDerivedStateFromError(error: Error): State {
    const errorMessage = error.message.toLowerCase();
    const isDependencyError = 
      errorMessage.includes('dependency') || 
      errorMessage.includes('module') || 
      errorMessage.includes('package') || 
      errorMessage.includes('import') ||
      errorMessage.includes('install');
      
    return { 
      hasError: true,
      error,
      errorInfo: null,
      isDependencyError
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Dependency Error Boundary caught an error:', error, errorInfo);
    
    // Update state with error details
    this.setState({
      error,
      errorInfo,
      isDependencyError: 
        error.message.toLowerCase().includes('dependency') || 
        error.message.toLowerCase().includes('module') || 
        error.message.toLowerCase().includes('package') ||
        error.message.toLowerCase().includes('import') ||
        error.message.toLowerCase().includes('install')
    });
    
    // Log to an error reporting service if needed
    // reportError(error, errorInfo);
  }
  
  handleRefresh = (): void => {
    window.location.reload();
  };
  
  handleClearCache = (): void => {
    if ('caches' in window) {
      caches.keys().then(function(names) {
        for (let name of names) caches.delete(name);
      });
    }
    
    // Clear localStorage
    localStorage.clear();
    
    // Clear sessionStorage
    sessionStorage.clear();
    
    // Reload the page
    window.location.reload();
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Render an error message
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      // Default error UI
      return (
        <Card className="border-amber-300 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800/50">
          <CardHeader>
            <CardTitle className="flex items-center text-amber-800 dark:text-amber-200">
              <AlertTriangle className="mr-2 h-5 w-5" />
              {this.state.isDependencyError 
                ? 'Dependency Loading Error' 
                : 'Something went wrong'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-amber-800 dark:text-amber-200">
              {this.state.isDependencyError ? (
                <p>
                  There was a problem loading a required package. This can happen due to network issues 
                  or temporary service disruptions.
                </p>
              ) : (
                <p>An unexpected error occurred while rendering this component.</p>
              )}
              
              {this.state.error && (
                <div className="mt-2 p-2 bg-amber-100 dark:bg-amber-900/40 rounded text-xs font-mono overflow-auto max-h-[200px]">
                  {this.state.error.toString()}
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-2">
            <Button variant="default" onClick={this.handleRefresh} className="w-full sm:w-auto">
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh Page
            </Button>
            
            {this.state.isDependencyError && (
              <Button variant="outline" onClick={this.handleClearCache} className="w-full sm:w-auto">
                Clear Cache & Refresh
              </Button>
            )}
          </CardFooter>
        </Card>
      );
    }

    return this.props.children;
  }
}

export default DependencyErrorBoundary;
