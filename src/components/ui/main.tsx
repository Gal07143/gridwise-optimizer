
import React from 'react';
import { cn } from '@/lib/utils';

export interface MainProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
}

export const Main = React.forwardRef<HTMLDivElement, MainProps>(
  ({ className, children, title, description, ...props }, ref) => {
    return (
      <main
        ref={ref}
        className={cn("flex-1 overflow-auto p-6", className)}
        {...props}
      >
        {title && (
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-2">{title}</h1>
            {description && <p className="text-muted-foreground">{description}</p>}
          </div>
        )}
        {children}
      </main>
    );
  }
);
Main.displayName = 'Main';
