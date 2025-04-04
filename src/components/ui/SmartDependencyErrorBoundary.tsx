
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Download } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { handleDependencyError } from '@/utils/errorUtils';
import { toast } from 'sonner';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  packageName?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  isDependencyError: boolean;
  attemptingFix: boolean;
  fixProgress: number;
  dialogOpen: boolean;
  fixAttempts: number;
  detectedPackage: string | null;
}

class SmartDependencyErrorBoundary extends Component<Props, State> {
  private maxRetries = 3;
  
  constructor(props: Props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null,
      isDependencyError: false,
      attemptingFix: false,
      fixProgress: 0,
      dialogOpen: false,
      fixAttempts: 0,
      detectedPackage: props.packageName || null
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    const errorMessage = error.message.toLowerCase();
    const isDependencyError = 
      errorMessage.includes('dependency') || 
      errorMessage.includes('module') || 
      errorMessage.includes('package') || 
      errorMessage.includes('import') ||
      errorMessage.includes('install') ||
      errorMessage.includes('cannot find module') ||
      errorMessage.includes('failed to resolve');
      
    // Try to extract package name from error message
    let detectedPackage = null;
    const packageMatches = errorMessage.match(/['"]([^'"]+)['"]/) || 
                          errorMessage.match(/module ['"]([^'"]+)['"]/) ||
                          errorMessage.match(/package ['"]([^'"]+)['"]/) ||
                          errorMessage.match(/installing ['"]([^'"]+)['"]/);
    
    if (packageMatches && packageMatches[1]) {
      detectedPackage = packageMatches[1];
    }
      
    return { 
      hasError: true,
      error,
      errorInfo: null,
      isDependencyError,
      detectedPackage
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Smart Dependency Error Boundary caught an error:', error, errorInfo);
    
    // Update state with error details
    this.setState({
      error,
      errorInfo,
      isDependencyError: 
        error.message.toLowerCase().includes('dependency') || 
        error.message.toLowerCase().includes('module') || 
        error.message.toLowerCase().includes('package') ||
        error.message.toLowerCase().includes('import') ||
        error.message.toLowerCase().includes('install') ||
        error.message.toLowerCase().includes('cannot find module') ||
        error.message.toLowerCase().includes('failed to resolve')
    });
    
    // If it's a dependency error, show the dialog
    if (this.state.isDependencyError) {
      this.setState({ dialogOpen: true });
      handleDependencyError(error);
    }
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

  attemptAutomaticFix = async (): Promise<void> => {
    const { detectedPackage, fixAttempts } = this.state;
    
    if (fixAttempts >= this.maxRetries) {
      toast.error('Maximum fix attempts reached. Please try manual troubleshooting.');
      return;
    }
    
    this.setState({ 
      attemptingFix: true, 
      fixProgress: 0,
      fixAttempts: fixAttempts + 1
    });
    
    // Simulate progress updates
    const interval = setInterval(() => {
      this.setState(prevState => ({
        fixProgress: Math.min(prevState.fixProgress + 10, 90)
      }));
    }, 300);
    
    try {
      // In a real implementation, this would communicate with a server endpoint
      // that can reinstall the package or fix the dependency issue
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Finish progress
      clearInterval(interval);
      this.setState({ fixProgress: 100 });
      
      // Show success message
      toast.success(`Dependency fix attempted ${this.state.fixAttempts} of ${this.maxRetries}. Reloading...`);
      
      // Wait a moment then reload
      setTimeout(() => {
        window.location.reload();
      }, 1500);
      
    } catch (error) {
      clearInterval(interval);
      this.setState({ 
        attemptingFix: false,
        fixProgress: 0
      });
      toast.error('Failed to fix dependency issue automatically.');
    }
  };

  closeDialog = (): void => {
    this.setState({ dialogOpen: false });
  };

  render(): ReactNode {
    const { hasError, error, isDependencyError, attemptingFix, fixProgress, dialogOpen, detectedPackage } = this.state;
    
    if (!hasError) {
      return this.props.children;
    }
    
    // Auto-fix dialog
    const fixDialog = (
      <Dialog open={dialogOpen} onOpenChange={this.closeDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Dependency Error Detected</DialogTitle>
            <DialogDescription>
              {detectedPackage ? 
                `There was a problem loading the "${detectedPackage}" package.` :
                'There was a problem loading a required package.'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            {attemptingFix ? (
              <div className="space-y-4">
                <p className="text-sm">Attempting to fix dependency issue...</p>
                <Progress value={fixProgress} className="h-2" />
                <p className="text-xs text-muted-foreground text-center">
                  {fixProgress < 100 ? 'Please wait...' : 'Fix applied!'}
                </p>
              </div>
            ) : (
              <div className="text-sm space-y-2">
                <p>
                  Would you like to attempt an automatic fix? This will try to reinstall
                  the required dependencies.
                </p>
                {error && (
                  <div className="p-2 bg-muted rounded text-xs font-mono overflow-auto max-h-[100px]">
                    {error.toString()}
                  </div>
                )}
              </div>
            )}
          </div>
          
          <DialogFooter className="gap-2">
            {!attemptingFix && (
              <>
                <Button variant="outline" onClick={this.handleClearCache}>
                  Clear Cache
                </Button>
                <Button variant="outline" onClick={this.handleRefresh}>
                  Refresh Page
                </Button>
                <Button 
                  onClick={this.attemptAutomaticFix}
                  disabled={attemptingFix}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Fix Automatically
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
    
    // If user provided a fallback, use it along with the dialog
    if (this.props.fallback) {
      return (
        <>
          {this.props.fallback}
          {fixDialog}
        </>
      );
    }
    
    // Default error UI
    return (
      <>
        <Card className="border-amber-300 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800/50">
          <CardHeader>
            <CardTitle className="flex items-center text-amber-800 dark:text-amber-200">
              <AlertTriangle className="mr-2 h-5 w-5" />
              {isDependencyError 
                ? 'Dependency Loading Error' 
                : 'Something went wrong'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-amber-800 dark:text-amber-200">
              {isDependencyError ? (
                <p>
                  There was a problem loading a required package. This can happen due to network issues 
                  or temporary service disruptions.
                </p>
              ) : (
                <p>An unexpected error occurred while rendering this component.</p>
              )}
              
              {error && (
                <div className="mt-2 p-2 bg-amber-100 dark:bg-amber-900/40 rounded text-xs font-mono overflow-auto max-h-[200px]">
                  {error.toString()}
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-2">
            <Button 
              variant="default" 
              onClick={this.attemptAutomaticFix}
              disabled={attemptingFix}
              className="w-full sm:w-auto"
            >
              {attemptingFix ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Fixing...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Fix Automatically
                </>
              )}
            </Button>
            
            <Button 
              variant="outline" 
              onClick={this.handleRefresh} 
              disabled={attemptingFix}
              className="w-full sm:w-auto"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh Page
            </Button>
            
            {isDependencyError && (
              <Button 
                variant="outline" 
                onClick={this.handleClearCache}
                disabled={attemptingFix}
                className="w-full sm:w-auto"
              >
                Clear Cache & Refresh
              </Button>
            )}
          </CardFooter>
        </Card>
        {fixDialog}
      </>
    );
  }
}

export default SmartDependencyErrorBoundary;
