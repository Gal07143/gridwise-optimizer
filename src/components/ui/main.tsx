
import React from 'react';
import { cn } from '@/lib/utils';

type ContainerSize = 'default' | 'small' | 'large' | 'full';

interface MainProps extends React.HTMLAttributes<HTMLDivElement> {
  containerSize?: ContainerSize;
}

export const Main: React.FC<MainProps> = ({ 
  className, 
  containerSize = 'default', 
  children,
  ...props 
}) => {
  const containerClasses = {
    default: 'max-w-7xl',
    small: 'max-w-4xl',
    large: 'max-w-screen-2xl',
    full: 'max-w-full',
  };

  return (
    <main 
      className={cn(
        'flex-grow p-6', 
        className
      )}
      {...props}
    >
      <div className={cn(
        'mx-auto w-full', 
        containerClasses[containerSize]
      )}>
        {children}
      </div>
    </main>
  );
};

export default Main;
