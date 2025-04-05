
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface Props {
  children: ReactNode;
  fallback?: React.ReactNode;
  dependencies?: string[];
  onRetry?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class SmartDependencyErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({
      error,
      errorInfo
    });
    console.error("Error caught by SmartDependencyErrorBoundary:", error, errorInfo);
  }

  reset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
    if (this.props.onRetry) {
      this.props.onRetry();
    }
  };

  renderDependencyMessage(): string {
    const { dependencies } = this.props;
    if (!dependencies || dependencies.length === 0) {
      return "This component requires configuration to work properly.";
    }

    if (dependencies.length === 1) {
      return `This component requires ${dependencies[0]} to be configured.`;
    }

    const lastDependency = dependencies[dependencies.length - 1];
    const otherDependencies = dependencies.slice(0, -1).join(", ");
    return `This component requires ${otherDependencies} and ${lastDependency} to be configured.`;
  }

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-amber-700 flex items-center text-base font-medium">
              <AlertCircle className="h-4 w-4 mr-2" />
              Component Error
            </CardTitle>
            <CardDescription className="text-amber-600">
              {this.renderDependencyMessage()}
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-2 text-amber-700 text-xs">
            <div className="font-mono overflow-auto max-h-32 p-2 bg-amber-100 dark:bg-amber-950/50 rounded">
              {this.state.error?.toString()}
            </div>
          </CardContent>
          <CardFooter>
            <Button size="sm" variant="outline" onClick={this.reset} className="text-amber-700 border-amber-300">
              Retry
            </Button>
          </CardFooter>
        </Card>
      );
    }

    return this.props.children;
  }
}

export default SmartDependencyErrorBoundary;
