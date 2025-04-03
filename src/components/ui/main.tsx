
import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import ErrorBoundary from './ErrorBoundary';
import { useIsMobile } from '@/hooks/use-mobile';

interface MainProps {
  children: ReactNode;
  className?: string;
  title?: string;
  containerSize?: 'sm' | 'default' | 'lg' | 'xl' | 'full';
  noPadding?: boolean;
  isLoading?: boolean;
  loadingText?: string;
  error?: Error | null;
  retry?: () => void;
  fluid?: boolean;
}

export const Main: React.FC<MainProps> = ({
  children,
  className,
  title,
  containerSize = 'default',
  noPadding = false,
  isLoading = false,
  loadingText = 'Loading...',
  error = null,
  retry,
  fluid = false,
}) => {
  const isMobile = useIsMobile();
  
  const containerSizeClass = {
    sm: 'max-w-screen-sm',
    default: 'max-w-7xl',
    lg: 'max-w-screen-lg',
    xl: 'max-w-screen-xl',
    full: 'max-w-full',
  }[containerSize];

  return (
    <main
      className={cn(
        'flex-1 overflow-auto py-6 px-4',
        noPadding && 'p-0',
        'bg-background dark:bg-background',
        className
      )}
    >
      <ErrorBoundary>
        <div className={cn(
          'mx-auto',
          !fluid && containerSizeClass
        )}>
          {title && (
            <div className="mb-6">
              <h1 className="text-2xl font-bold">{title}</h1>
            </div>
          )}
          {children}
        </div>
      </ErrorBoundary>
    </main>
  );
};
