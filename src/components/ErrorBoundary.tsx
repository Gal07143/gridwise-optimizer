
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ErrorMessage } from './ui/error-message';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-slate-900">
          <ErrorMessage
            title="Something went wrong"
            message={this.state.error?.message || 
              "Minified React error #426; visit https://reactjs.org/docs/error-decoder.html?invariant=426 for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}
            onRetry={this.handleReset}
          />
        </div>
      );
    }

    return this.props.children;
  }
}
