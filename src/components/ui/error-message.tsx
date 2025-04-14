
import { ExclamationCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorMessageProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorMessage({ 
  title = "Something went wrong", 
  message = "An unexpected error occurred. Please try again or contact support if the problem persists.", 
  onRetry 
}: ErrorMessageProps) {
  return (
    <div className="w-full max-w-md mx-auto rounded-lg bg-black bg-opacity-90 text-white p-6 border border-red-900/30">
      <div className="flex items-start space-x-3">
        <ExclamationCircle className="h-6 w-6 text-red-500 mt-0.5" />
        <div className="flex-1">
          <h3 className="text-lg font-medium text-red-400 mb-2">{title}</h3>
          <p className="text-sm text-gray-300 mb-4">{message}</p>
          
          {onRetry && (
            <Button 
              onClick={onRetry}
              variant="outline" 
              className="bg-transparent hover:bg-white/10 border-white/20 text-white hover:text-white"
            >
              Try again
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
