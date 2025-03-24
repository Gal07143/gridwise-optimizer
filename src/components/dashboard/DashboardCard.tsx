
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export interface DashboardCardProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  badge?: string;
  badgeVariant?: 'default' | 'secondary' | 'destructive' | 'outline';
  className?: string;
  children: React.ReactNode;
  isLoading?: boolean;
  loadingText?: string;
  style?: React.CSSProperties;
}

const DashboardCard = ({
  title,
  description,
  icon,
  badge,
  badgeVariant = 'outline',
  className,
  children,
  isLoading = false,
  loadingText = 'Loading...',
  style
}: DashboardCardProps) => {
  return (
    <Card className={cn("transition-all duration-200 overflow-hidden", className)} style={style}>
      <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
        <div>
          <div className="flex items-center">
            {icon && <span className="mr-2 text-muted-foreground">{icon}</span>}
            <CardTitle className="text-lg font-medium">{title}</CardTitle>
            {badge && (
              <Badge variant={badgeVariant} className="ml-2">
                {badge}
              </Badge>
            )}
          </div>
          {description && <CardDescription>{description}</CardDescription>}
        </div>
      </CardHeader>
      <CardContent className="p-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-40">
            <div className="animate-pulse">
              <div className="h-4 w-32 bg-slate-200 dark:bg-slate-700 rounded mb-2.5"></div>
              <div className="h-2 w-48 bg-slate-200 dark:bg-slate-700 rounded"></div>
            </div>
          </div>
        ) : (
          children
        )}
      </CardContent>
    </Card>
  );
};

export default DashboardCard;
