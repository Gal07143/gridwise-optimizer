
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
  loading?: boolean; // alias for isLoading for backward compatibility
  loadingText?: string;
  style?: React.CSSProperties;
  actions?: React.ReactNode;
  footer?: React.ReactNode;
  onClick?: () => void;
  headerClassName?: string;
  contentClassName?: string;
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
  loading = false, // for backward compatibility
  loadingText = 'Loading...',
  style,
  actions,
  footer,
  onClick,
  headerClassName,
  contentClassName
}: DashboardCardProps) => {
  // For backward compatibility
  const showLoading = isLoading || loading;
  
  return (
    <Card 
      className={cn(
        "transition-all duration-200 overflow-hidden h-full", 
        onClick && "cursor-pointer hover:shadow-md",
        className
      )} 
      style={style}
      onClick={onClick}
    >
      <CardHeader className={cn("pb-2 flex flex-row items-center justify-between space-y-0", headerClassName)}>
        <div>
          <div className="flex items-center">
            {icon && <span className="mr-2 text-muted-foreground">{icon}</span>}
            <CardTitle className="text-base font-medium">{title}</CardTitle>
            {badge && (
              <Badge variant={badgeVariant} className="ml-2">
                {badge}
              </Badge>
            )}
          </div>
          {description && <CardDescription className="text-xs">{description}</CardDescription>}
        </div>
        {actions && <div className="flex items-center space-x-2">{actions}</div>}
      </CardHeader>
      <CardContent className={cn("p-3", contentClassName)}>
        {showLoading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-pulse">
              <div className="h-4 w-32 bg-slate-200 dark:bg-slate-700 rounded mb-2.5"></div>
              <div className="h-2 w-48 bg-slate-200 dark:bg-slate-700 rounded"></div>
            </div>
          </div>
        ) : (
          children
        )}
      </CardContent>
      {footer && (
        <div className="px-3 pb-3 pt-0">
          {footer}
        </div>
      )}
    </Card>
  );
};

export default DashboardCard;
