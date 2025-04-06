
import React from 'react';
import { cn } from '@/lib/utils';

export interface MainProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  containerSize?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full' | string;
  children: React.ReactNode;
}

const Main = React.forwardRef<HTMLDivElement, MainProps>(
  ({ title, description, containerSize = 'xl', className, children, ...props }, ref) => {
    const containerClasses = {
      sm: 'max-w-screen-sm',
      md: 'max-w-screen-md',
      lg: 'max-w-screen-lg',
      xl: 'max-w-screen-xl',
      '2xl': 'max-w-screen-2xl',
      full: 'max-w-full',
    };

    const containerClass = containerClasses[containerSize as keyof typeof containerClasses] || containerClasses.xl;

    return (
      <main
        ref={ref}
        className={cn('flex-1 px-4 sm:px-6 py-6', className)}
        {...props}
      >
        {(title || description) && (
          <header className="mb-6">
            {title && <h1 className="text-3xl font-bold">{title}</h1>}
            {description && <p className="text-muted-foreground mt-2">{description}</p>}
          </header>
        )}
        <div className={cn('mx-auto', containerClass)}>
          {children}
        </div>
      </main>
    );
  }
);

Main.displayName = 'Main';

export { Main };
