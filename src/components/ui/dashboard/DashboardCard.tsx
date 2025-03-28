
import React, { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

export interface DashboardCardProps {
  title: string;
  children: ReactNode;
  icon?: ReactNode;
  className?: string;
  isLoading?: boolean;
  actions?: ReactNode;
  badge?: ReactNode;
  style?: React.CSSProperties;
  loading?: boolean; // For backward compatibility
  gradient?: boolean;
  interactive?: boolean;
}

const DashboardCard = ({
  title,
  children,
  icon,
  className,
  isLoading,
  actions,
  badge,
  style,
  loading,
  gradient = false,
  interactive = true,
}: DashboardCardProps) => {
  // Use loading for backward compatibility
  const isContentLoading = isLoading || loading;
  
  return (
    <Card 
      className={cn(
        "h-full border border-gray-100 dark:border-gray-700/30 overflow-hidden bg-white dark:bg-gridx-dark-gray/90",
        gradient && "bg-gradient-to-b from-white to-gray-50 dark:from-gridx-dark-gray/95 dark:to-gridx-navy/95",
        interactive && "transition-all duration-300 hover:shadow-md hover:translate-y-[-2px]",
        "animate-in fade-in slide-in-from-bottom-4 duration-700",
        className
      )} 
      style={style}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-md font-medium flex items-center gap-2 text-gridx-navy dark:text-white/90">
          {icon && <span className="text-gridx-blue">{icon}</span>}
          {title}
        </CardTitle>
        {badge && <div>{badge}</div>}
        {actions && <div>{actions}</div>}
      </CardHeader>
      <CardContent>
        {isContentLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-[125px] w-full" />
          </div>
        ) : (
          children
        )}
      </CardContent>
    </Card>
  );
};

export default DashboardCard;
