
import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'primary' | 'secondary' | 'ghost';
  className?: string;
  text?: string;
  fullScreen?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  variant = 'default',
  className,
  text,
  fullScreen = false,
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12',
  };

  const variantClasses = {
    default: 'text-muted-foreground',
    primary: 'text-primary',
    secondary: 'text-secondary-foreground',
    ghost: 'text-gray-400',
  };

  const spinnerClasses = cn(
    'animate-spin',
    sizeClasses[size],
    variantClasses[variant],
    className
  );

  const content = (
    <div className={cn(
      "flex flex-col items-center justify-center",
      fullScreen ? "fixed inset-0 bg-background/80 backdrop-blur-sm z-50" : ""
    )}>
      <Loader2 className={spinnerClasses} />
      {text && (
        <span className={cn(
          "mt-2 text-sm",
          variantClasses[variant]
        )}>
          {text}
        </span>
      )}
    </div>
  );

  return content;
};

export default LoadingSpinner;
