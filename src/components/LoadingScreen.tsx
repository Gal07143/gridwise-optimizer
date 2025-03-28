
import React from 'react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface LoadingScreenProps {
  message?: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ message = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="flex flex-col items-center space-y-4">
        <LoadingSpinner size="lg" />
        <p className="text-muted-foreground text-lg">{message}</p>
      </div>
    </div>
  );
};

export default LoadingScreen;
