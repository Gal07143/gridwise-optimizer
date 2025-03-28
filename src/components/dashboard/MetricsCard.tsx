
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ArrowDownIcon, ArrowUpIcon } from 'lucide-react';

export interface MetricsCardProps {
  title: string;
  value: number | string;
  unit?: string;
  changeValue?: number;
  changeType?: 'increase' | 'decrease' | 'neutral';
  description?: string;
  icon?: React.ReactNode;
  animationDelay?: string;
  className?: string;
  gradient?: boolean;
}

const MetricsCard: React.FC<MetricsCardProps> = ({
  title,
  value,
  unit = '',
  changeValue,
  changeType = 'neutral',
  description,
  icon,
  animationDelay = '0ms',
  className,
  gradient = true
}) => {
  return (
    <Card 
      className={cn(
        "overflow-hidden border border-white/10 dark:border-white/5 shadow-md",
        gradient && "bg-gradient-to-br from-white/30 to-white/5 dark:from-gray-800/40 dark:to-gray-900/20 backdrop-blur-md",
        "hover-scale",
        "animate-in fade-in slide-in-from-bottom-4 duration-700",
        className
      )}
      style={{ animationDelay }}
    >
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-2">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">{title}</p>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold">{value}</span>
              {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
            </div>
          </div>
          {icon && (
            <div className="p-2 bg-primary/10 rounded-lg backdrop-blur-sm">
              {icon}
            </div>
          )}
        </div>
        
        {(changeValue !== undefined || description) && (
          <div className="mt-2 flex items-center justify-between">
            {changeValue !== undefined && (
              <div className={cn(
                "text-xs font-medium flex items-center",
                changeType === 'increase' ? "text-green-500" : 
                changeType === 'decrease' ? "text-red-500" : 
                "text-muted-foreground"
              )}>
                {changeType === 'increase' && <ArrowUpIcon className="h-3 w-3 mr-1" />}
                {changeType === 'decrease' && <ArrowDownIcon className="h-3 w-3 mr-1" />}
                {changeType === 'increase' ? '+' : ''}{changeValue}%
              </div>
            )}
            {description && (
              <div className="text-xs text-muted-foreground">
                {description}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MetricsCard;
