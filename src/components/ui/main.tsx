import React from 'react';

export interface MainProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  className?: string;
}

const Main = ({ 
  children, 
  title, 
  description, 
  className = '' 
}: MainProps) => {
  return (
    <main className={`flex-1 p-4 md:p-6 ${className}`}>
      {(title || description) && (
        <div className="mb-6">
          {title && <h1 className="text-2xl font-bold tracking-tight">{title}</h1>}
          {description && <p className="text-muted-foreground mt-1">{description}</p>}
        </div>
      )}
      {children}
    </main>
  );
};

export default Main;
