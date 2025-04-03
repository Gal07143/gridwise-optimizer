
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from './button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './card';
import { toast } from 'sonner';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class GlobalErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    this.setState({ errorInfo });
    
    // Log to monitoring service if available
    // reportError(error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  private handleHome = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = '/dashboard';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen p-4 bg-background">
          <Card className="w-full max-w-md border-destructive/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-5 w-5" />
                Something went wrong
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  The application encountered an unexpected error. This has been logged for review.
                </p>
                {this.state.error && (
                  <div className="p-3 bg-muted/50 rounded-md text-xs font-mono overflow-auto max-h-[200px]">
                    {this.state.error.toString()}
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-2">
              <Button variant="default" onClick={this.handleReset} className="w-full sm:w-auto">
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh Page
              </Button>
              <Button variant="outline" onClick={this.handleHome} className="w-full sm:w-auto">
                <Home className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
            </CardFooter>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default GlobalErrorBoundary;
