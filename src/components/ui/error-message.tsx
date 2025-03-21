
import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface ErrorMessageProps {
  message: string;
  description?: string;
  retryAction?: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  description,
  retryAction,
}) => {
  return (
    <Alert variant="destructive" className="flex flex-col items-start gap-4">
      <div className="flex items-start gap-3">
        <AlertCircle className="h-5 w-5" />
        <div>
          <AlertTitle>{message}</AlertTitle>
          {description && <AlertDescription>{description}</AlertDescription>}
        </div>
      </div>
      
      {retryAction && (
        <Button 
          variant="outline" 
          size="sm" 
          className="ml-8" 
          onClick={retryAction}
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Try Again
        </Button>
      )}
    </Alert>
  );
};

export default ErrorMessage;
