
import React, { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { InfoIcon } from 'lucide-react';

export type ChangeType = 'increase' | 'decrease' | 'neutral';

export interface MetricsCardProps {
  title: string;
  value: number | string;
  unit?: string;
  changeType?: ChangeType;
  changeValue?: number | string;
  description?: string;
  icon?: ReactNode;
  status?: 'success' | 'warning' | 'error' | string;
  tooltipContent?: string;
  animationDelay?: string;
  isLoading?: boolean;
}

export const MetricsCard: React.FC<MetricsCardProps> = ({
  title,
  value,
  unit,
  changeType = 'neutral',
  changeValue,
  description,
  icon,
  status,
  tooltipContent,
  animationDelay,
  isLoading = false
}) => {
  const getStatusColor = () => {
    switch (status) {
      case 'success': return 'text-green-500';
      case 'warning': return 'text-yellow-500';
      case 'error': return 'text-red-500';
      default: return 'text-primary';
    }
  };

  const getChangeColor = () => {
    switch (changeType) {
      case 'increase': return 'text-green-500';
      case 'decrease': return 'text-red-500';
      case 'neutral': return 'text-gray-500';
      default: return 'text-gray-500';
    }
  };

  const getChangeArrow = () => {
    switch (changeType) {
      case 'increase': return '↑';
      case 'decrease': return '↓';
      case 'neutral': return '→';
      default: return '';
    }
  };

  const cardStyle = {
    animationDelay: animationDelay || '0ms'
  };

  if (isLoading) {
    return (
      <Card className="animate-in fade-in-50 duration-500 slide-in-from-bottom-5" style={cardStyle}>
        <CardContent className="p-6">
          <Skeleton className="h-4 w-28 mb-3" />
          <Skeleton className="h-8 w-36 mb-2" />
          <Skeleton className="h-4 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn(
      "overflow-hidden animate-in fade-in-50 duration-500 slide-in-from-bottom-5",
      status && `border-l-4 border-l-${status === 'success' ? 'green' : status === 'warning' ? 'yellow' : status === 'error' ? 'red' : 'primary'}-500`
    )} style={cardStyle}>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
              {title}
              {tooltipContent && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <InfoIcon className="h-3.5 w-3.5 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{tooltipContent}</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
            <div className="flex items-end gap-1 mb-1">
              <div className={cn("text-2xl font-bold", getStatusColor())}>
                {value}
              </div>
              {unit && <div className="text-sm text-muted-foreground ml-1">
                {unit}
              </div>}
            </div>
            {changeValue && (
              <div className={cn("text-sm flex items-center gap-1", getChangeColor())}>
                <span>{getChangeArrow()}</span>
                <span>{changeValue}</span>
              </div>
            )}
            {description && (
              <div className="text-xs text-muted-foreground mt-1">
                {description}
              </div>
            )}
          </div>
          {icon && (
            <div className="p-2 rounded-full bg-primary/10">
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MetricsCard;
