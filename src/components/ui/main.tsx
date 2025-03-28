
import React from 'react';
import { cn } from '@/lib/utils';

interface MainProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  containerSize?: 'default' | 'small' | 'large' | 'full';
}

export const Main = React.forwardRef<HTMLDivElement, MainProps>(
  ({ children, className, containerSize = 'default', style, ...props }, ref) => {
    const paddingStyles = {
      small: 'px-4 py-4 sm:px-6',
      default: 'px-4 py-6 sm:px-6 md:px-8',
      large: 'px-4 py-8 sm:px-6 md:px-8 lg:px-12',
      full: 'p-0',
    };

    // Fix: Use CSS custom properties in a type-safe way
    const customStyle = {
      '--content-padding': paddingStyles[containerSize],
    } as React.CSSProperties;

    return (
      <main
        ref={ref}
        className={cn('flex-1', className)}
        style={{ ...customStyle, ...style }}
        {...props}
      >
        {children}
      </main>
    );
  }
);

Main.displayName = 'Main';
