
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
  style?: React.CSSProperties; // Added style prop for animation delay
  loading?: boolean; // Added for backward compatibility
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
  loading, // For backward compatibility
}: DashboardCardProps) => {
  // Use loading for backward compatibility
  const isContentLoading = isLoading || loading;
  
  return (
    <Card className={cn("h-full", className)} style={style}>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-md font-medium flex items-center gap-2">
          {icon && <span className="text-muted-foreground">{icon}</span>}
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
