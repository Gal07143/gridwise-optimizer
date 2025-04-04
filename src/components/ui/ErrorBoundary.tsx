
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import SmartDependencyErrorBoundary from './SmartDependencyErrorBoundary';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return { 
      hasError: true,
      error,
      errorInfo: null
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Error Boundary caught an error:', error, errorInfo);
    
    // Update state with error details
    this.setState({
      error,
      errorInfo
    });
    
    // Log to an error reporting service if needed
    // reportError(error, errorInfo);
  }
  
  handleRefresh = (): void => {
    window.location.reload();
  };

  render(): ReactNode {
    // First check if it might be a dependency error
    const errorMessage = this.state.error?.message?.toLowerCase() || '';
    const isDependencyError = 
      errorMessage.includes('dependency') || 
      errorMessage.includes('module') || 
      errorMessage.includes('package') || 
      errorMessage.includes('import') ||
      errorMessage.includes('install');
    
    // If it seems like a dependency error, use the specialized boundary
    if (this.state.hasError && isDependencyError) {
      return (
        <SmartDependencyErrorBoundary fallback={this.props.fallback}>
          {this.props.children}
        </SmartDependencyErrorBoundary>
      );
    }
    
    if (this.state.hasError) {
      // Render fallback UI if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      // Default error UI
      return (
        <Card className="border-red-300 bg-red-50 dark:bg-red-900/20 dark:border-red-800/50">
          <CardHeader>
            <CardTitle className="flex items-center text-red-800 dark:text-red-200">
              <AlertTriangle className="mr-2 h-5 w-5" />
              Something went wrong
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-red-800 dark:text-red-200">
              <p>An error occurred while rendering this component.</p>
              
              {this.state.error && (
                <div className="mt-2 p-2 bg-red-100 dark:bg-red-900/40 rounded text-xs font-mono overflow-auto max-h-[200px]">
                  {this.state.error.toString()}
                </div>
              )}
              
              {this.state.errorInfo && (
                <div className="mt-2 p-2 bg-red-100 dark:bg-red-900/40 rounded text-xs font-mono overflow-auto max-h-[200px]">
                  <details>
                    <summary>Component Stack</summary>
                    {this.state.errorInfo.componentStack}
                  </details>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="destructive" onClick={this.handleRefresh}>
              Refresh Page
            </Button>
          </CardFooter>
        </Card>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
