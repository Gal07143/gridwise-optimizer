
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';

export interface DashboardCardProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  badge?: string;
  badgeVariant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success';
  className?: string;
  children: React.ReactNode;
  isLoading?: boolean;
  loadingText?: string;
  style?: React.CSSProperties;
  actions?: React.ReactNode;
  footer?: React.ReactNode;
  onClick?: () => void;
  headerClassName?: string;
  contentClassName?: string;
  tooltip?: string;
  compact?: boolean;
  highlightBorder?: boolean;
  elevation?: 'flat' | 'low' | 'medium' | 'high';
  status?: 'success' | 'warning' | 'error' | 'info' | 'default';
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
  style,
  actions,
  footer,
  onClick,
  headerClassName,
  contentClassName,
  tooltip,
  compact = false,
  highlightBorder = false,
  elevation = 'flat',
  status = 'default'
}: DashboardCardProps) => {
  // Determine elevation class
  const elevationClass = 
    elevation === 'high' ? 'shadow-lg' :
    elevation === 'medium' ? 'shadow-md' :
    elevation === 'low' ? 'shadow-sm' :
    '';
  
  // Determine status border color
  const statusBorderClass = 
    status === 'success' ? 'border-green-500' :
    status === 'warning' ? 'border-amber-500' :
    status === 'error' ? 'border-red-500' :
    status === 'info' ? 'border-blue-500' :
    highlightBorder ? 'border-primary' : '';
    
  return (
    <Card 
      className={cn(
        "transition-all duration-200 overflow-hidden h-full", 
        onClick && "cursor-pointer hover:shadow-md",
        elevationClass,
        statusBorderClass,
        className
      )} 
      style={style}
      onClick={onClick}
    >
      <CardHeader className={cn(
        "pb-2 flex flex-row items-center justify-between space-y-0", 
        compact && "p-3",
        headerClassName
      )}>
        <div>
          <div className="flex items-center">
            {icon && <span className="mr-2 text-muted-foreground">{icon}</span>}
            <CardTitle className={cn("text-base font-medium", compact && "text-sm")}>
              {title}
              {tooltip && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 ml-1 inline-block text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">{tooltip}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </CardTitle>
            {badge && (
              <Badge variant={badgeVariant} className="ml-2">
                {badge}
              </Badge>
            )}
          </div>
          {description && (
            <CardDescription className={cn("text-xs", compact && "text-xs")}>
              {description}
            </CardDescription>
          )}
        </div>
        {actions && <div className="flex items-center space-x-2">{actions}</div>}
      </CardHeader>
      <CardContent className={cn("p-3", contentClassName)}>
        {isLoading ? (
          <div className="flex flex-col space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-4 w-1/2" />
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
