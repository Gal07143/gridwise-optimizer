
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
  gradient = true,
  interactive = true,
}: DashboardCardProps) => {
  // Use loading for backward compatibility
  const isContentLoading = isLoading || loading;
  
  return (
    <Card 
      className={cn(
        "h-full border-white/10 dark:border-white/5 overflow-hidden",
        gradient && "bg-gradient-to-br from-white/30 to-white/5 dark:from-gray-800/50 dark:to-gray-900/30 backdrop-blur-md",
        interactive && "transition-all duration-300 hover:shadow-xl hover:translate-y-[-2px]",
        "animate-in fade-in slide-in-from-bottom-4 duration-700",
        className
      )} 
      style={style}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-md font-medium flex items-center gap-2">
          {icon && <span className="text-primary/90">{icon}</span>}
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
