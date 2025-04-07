
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from './button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './card';

interface ErrorMessageProps {
  message: string;
  description?: string;
  retryAction?: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ 
  message,
  description,
  retryAction
}) => {
  return (
    <Card className="mx-auto max-w-lg">
      <CardHeader className="text-destructive">
        <div className="flex items-center">
          <AlertCircle className="h-6 w-6 mr-2" />
          <CardTitle>{message}</CardTitle>
        </div>
      </CardHeader>
      {description && (
        <CardContent>
          <CardDescription className="text-base text-destructive/80">
            {description}
          </CardDescription>
        </CardContent>
      )}
      {retryAction && (
        <CardFooter>
          <Button onClick={retryAction}>
            Retry
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default ErrorMessage;
