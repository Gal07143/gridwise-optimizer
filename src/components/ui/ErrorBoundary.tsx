
import React, { Component, ErrorInfo, ReactNode, useEffect } from 'react';
import { Button } from './button';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
  resetLabel?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

// MobileAwareErrorUI component to handle responsive error display
const MobileAwareErrorUI = ({ 
  error, 
  onReset, 
  resetLabel = "Try Again"
}: { 
  error: Error | null; 
  onReset: () => void;
  resetLabel?: string;
}) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="flex flex-col items-center justify-center h-full p-6 text-center">
      <div className="bg-destructive/10 p-4 rounded-full mb-4">
        <AlertTriangle className="h-10 w-10 text-destructive" />
      </div>
      <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
      <p className="text-muted-foreground mb-4 max-w-md">
        {error?.message || 'An unexpected error occurred. Please try again.'}
      </p>
      <div className={`flex ${isMobile ? 'flex-col' : 'flex-row'} gap-4`}>
        <Button 
          variant="outline" 
          onClick={onReset}
          className="flex items-center gap-2"
        >
          <RefreshCw size={16} />
          <span>{resetLabel}</span>
        </Button>
        <Button 
          onClick={() => {
            window.location.href = '/dashboard';
          }}
          className="flex items-center gap-2"
        >
          <Home size={16} />
          <span>Go to Dashboard</span>
        </Button>
      </div>
    </div>
  );
};

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can also log the error to an error reporting service
    console.error('Uncaught error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReset = () => {
    // Call the optional onReset prop if provided
    if (this.props.onReset) {
      this.props.onReset();
    }
    this.setState({ hasError: false, error: null, errorInfo: null });
  }

  public render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return this.props.fallback || (
        <MobileAwareErrorUI 
          error={this.state.error} 
          onReset={this.handleReset}
          resetLabel={this.props.resetLabel}
        />
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
