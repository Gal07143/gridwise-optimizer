
import React from 'react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';

interface MetricsCardProps {
  title: string;
  value: number | string;
  unit?: string;
  changeValue?: number;
  changeType?: 'increase' | 'decrease' | 'neutral';
  description?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  className?: string;
  status?: 'success' | 'warning' | 'error' | 'info';
  tooltipContent?: string;
  animationDelay?: string;
}

const MetricsCard = ({
  title,
  value,
  unit = '',
  changeValue,
  changeType,
  description,
  subtitle,
  icon,
  className,
  status,
  tooltipContent,
  animationDelay = '0ms',
}: MetricsCardProps) => {
  return (
    <div
      className={cn(
        "p-6 bg-card rounded-lg border shadow-sm",
        "animate-in fade-in-50 duration-500",
        {
          "border-green-200 shadow-green-100 dark:border-green-900/40 dark:shadow-green-900/20": status === 'success',
          "border-amber-200 shadow-amber-100 dark:border-amber-900/40 dark:shadow-amber-900/20": status === 'warning',
          "border-red-200 shadow-red-100 dark:border-red-900/40 dark:shadow-red-900/20": status === 'error',
          "border-blue-200 shadow-blue-100 dark:border-blue-900/40 dark:shadow-blue-900/20": status === 'info',
        },
        className
      )}
      style={{ animationDelay }}
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-1">
          {title}
          {tooltipContent && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-3.5 w-3.5 text-muted-foreground/70" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">{tooltipContent}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </h3>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </div>
      
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-bold">{value}</span>
        {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
      </div>
      
      {subtitle && (
        <div className="mt-1 text-sm text-muted-foreground">
          {subtitle}
        </div>
      )}
      
      {(changeValue !== undefined || description) && (
        <div className="mt-2 text-xs flex items-center">
          {changeValue !== undefined && changeType && (
            <span 
              className={cn("mr-1 px-1 py-0.5 rounded", {
                "text-green-700 bg-green-100 dark:text-green-400 dark:bg-green-900/30": changeType === 'increase',
                "text-red-700 bg-red-100 dark:text-red-400 dark:bg-red-900/30": changeType === 'decrease',
                "text-blue-700 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30": changeType === 'neutral',
              })}
            >
              {changeType === 'increase' ? '+' : changeType === 'decrease' ? '-' : ''}
              {Math.abs(changeValue)}%
            </span>
          )}
          
          {description && (
            <span className="text-muted-foreground">{description}</span>
          )}
        </div>
      )}
    </div>
  );
};

export default MetricsCard;
