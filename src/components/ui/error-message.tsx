
import React from 'react';
import { AlertCircle, RefreshCw, ArrowRight, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Link } from 'react-router-dom';

interface ErrorMessageProps {
  message: string;
  description?: string;
  retryAction?: () => void;
  helpLink?: string;
  helpText?: string;
  redirectLink?: string;
  redirectText?: string;
  variant?: 'destructive' | 'warning' | 'info';
  className?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  description,
  retryAction,
  helpLink,
  helpText = 'Get Help',
  redirectLink,
  redirectText,
  variant = 'destructive',
  className,
}) => {
  return (
    <Alert 
      variant={variant} 
      className={`flex flex-col items-start gap-4 ${className}`}
    >
      <div className="flex items-start gap-3">
        <AlertCircle className="h-5 w-5" />
        <div>
          <AlertTitle>{message}</AlertTitle>
          {description && <AlertDescription>{description}</AlertDescription>}
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2 ml-8">
        {retryAction && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={retryAction}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        )}
        
        {redirectLink && (
          <Button 
            variant="outline" 
            size="sm"
            asChild
          >
            <Link to={redirectLink}>
              <ArrowRight className="mr-2 h-4 w-4" />
              {redirectText || 'Continue'}
            </Link>
          </Button>
        )}
        
        {helpLink && (
          <Button 
            variant="link" 
            size="sm"
            asChild
            className="px-0 ml-auto"
          >
            <a href={helpLink} target="_blank" rel="noopener noreferrer">
              <HelpCircle className="mr-1 h-3 w-3" />
              {helpText}
            </a>
          </Button>
        )}
      </div>
    </Alert>
  );
};

export default ErrorMessage;
