
import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  text?: string; // Add text prop
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md',
  className = '',
  text
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-3',
    lg: 'h-12 w-12 border-4',
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className={`${sizeClasses[size]} ${className} animate-spin rounded-full border-b-transparent border-primary`}>
        <span className="sr-only">Loading...</span>
      </div>
      {text && <p className="mt-3 text-sm text-muted-foreground">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
