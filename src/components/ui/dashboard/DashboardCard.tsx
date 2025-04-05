import React from 'react';
import { cn } from '@/lib/utils';

export interface DashboardCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: React.ReactNode;
  icon?: React.ReactNode;
  variant?: 'default' | 'outline' | 'glass' | 'filled';
  size?: 'sm' | 'md' | 'lg';
  accent?: 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error' | 'none';
  isLoading?: boolean;
  animation?: boolean;
  className?: string;
  contentClassName?: string;
  headerClassName?: string;
  footerClassName?: string;
  footer?: React.ReactNode;
  children: React.ReactNode;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  icon,
  variant = 'default',
  size = 'md',
  accent = 'none',
  isLoading = false,
  animation = true,
  className,
  contentClassName,
  headerClassName,
  footerClassName,
  footer,
  children,
  ...props
}) => {
  const variantClasses = {
    default: 'bg-card shadow-sm dark:shadow-md',
    outline: 'bg-background border border-border',
    glass: 'bg-white/10 dark:bg-black/10 backdrop-blur-md border border-white/10 dark:border-white/5',
    filled: 'dark:bg-muted/30 bg-muted/30',
  };

  const sizeClasses = {
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  };

  const accentClasses = {
    none: '',
    primary: 'border-l-4 border-l-primary',
    secondary: 'border-l-4 border-l-secondary',
    info: 'border-l-4 border-l-blue-500',
    success: 'border-l-4 border-l-green-500',
    warning: 'border-l-4 border-l-yellow-500',
    error: 'border-l-4 border-l-red-500',
  };

  return (
    <div
      className={cn(
        'rounded-xl overflow-hidden transition-all duration-200',
        animation && 'hover:shadow-md hover:-translate-y-0.5',
        variantClasses[variant],
        accentClasses[accent],
        className
      )}
      {...props}
    >
      {(title || icon) && (
        <div className={cn(
          'flex items-center justify-between border-b border-border/30',
          sizeClasses[size],
          headerClassName
        )}>
          <div className="flex items-center space-x-3">
            {icon && <div className="text-muted-foreground">{icon}</div>}
            {typeof title === 'string' ? (
              <h3 className="font-medium text-card-foreground">{title}</h3>
            ) : (
              title
            )}
          </div>
        </div>
      )}

      <div className={cn(sizeClasses[size], contentClassName)}>
        {isLoading ? (
          <div className="flex items-center justify-center h-full min-h-[100px]">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        ) : (
          children
        )}
      </div>

      {footer && (
        <div
          className={cn(
            'border-t border-border/30',
            sizeClasses[size === 'sm' ? 'sm' : 'sm'],
            'text-xs text-muted-foreground',
            footerClassName
          )}
        >
          {footer}
        </div>
      )}
    </div>
  );
};

export default DashboardCard;
