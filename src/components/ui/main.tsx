
import React from 'react';
import { cn } from '@/lib/utils';

export interface MainProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

export const Main = React.forwardRef<HTMLDivElement, MainProps>(
  ({ children, className, title, description, ...props }, ref) => {
    return (
      <main
        ref={ref}
        className={cn("flex-1 p-6 md:p-8 lg:p-10", className)}
        {...props}
      >
        {(title || description) && (
          <div className="mb-6">
            {title && <h1 className="text-2xl font-semibold mb-2">{title}</h1>}
            {description && <p className="text-muted-foreground">{description}</p>}
          </div>
        )}
        {children}
      </main>
    );
  }
);
Main.displayName = "Main";

export default Main;
