
import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';

interface DashboardLayoutProps {
  children: ReactNode;
  className?: string;
}

export function DashboardLayout({ children, className }: DashboardLayoutProps) {
  return (
    <div className={cn('grid gap-4 md:gap-6', className)}>
      {children}
    </div>
  );
}

interface DashboardGridProps {
  children: ReactNode;
  className?: string;
  columns?: 1 | 2 | 3 | 4;
}

export function DashboardGrid({ 
  children, 
  className, 
  columns = 3 
}: DashboardGridProps) {
  return (
    <div 
      className={cn(
        'grid gap-4 md:gap-6', 
        columns === 1 && 'grid-cols-1',
        columns === 2 && 'grid-cols-1 md:grid-cols-2',
        columns === 3 && 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
        columns === 4 && 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
        className
      )}
    >
      {children}
    </div>
  );
}

interface DashboardCardProps {
  children: ReactNode;
  title?: string;
  description?: string;
  className?: string;
  gradient?: boolean;
}

export function DashboardCard({
  children,
  title,
  description,
  className,
  gradient = false,
}: DashboardCardProps) {
  return (
    <Card 
      className={cn(
        'overflow-hidden border border-gray-100 dark:border-gray-700/30',
        gradient && 'bg-gradient-to-b from-white to-gray-50 dark:from-slate-800 dark:to-slate-900',
        'transition-all duration-300 hover:shadow-md hover:-translate-y-1',
        'animate-in fade-in slide-in-from-bottom-4 duration-700',
        className
      )}
    >
      {(title || description) && (
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800/30">
          {title && <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">{title}</h3>}
          {description && <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{description}</p>}
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
    </Card>
  );
}

export default DashboardLayout;
