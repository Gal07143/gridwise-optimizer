
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ArrowDownIcon, ArrowUpIcon } from 'lucide-react';

export interface MetricsCardProps {
  title: string;
  value: number | string;
  unit: string;
  changeValue?: number;
  changeType?: 'increase' | 'decrease' | 'neutral';
  description?: string;
  icon?: React.ReactNode;
  animationDelay?: string;
  className?: string;
}

const MetricsCard: React.FC<MetricsCardProps> = ({
  title,
  value,
  unit,
  changeValue,
  changeType = 'neutral',
  description,
  icon,
  animationDelay = '0ms',
  className
}) => {
  return (
    <Card 
      className={cn(
        "overflow-hidden",
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
              <span className="text-sm text-muted-foreground">{unit}</span>
            </div>
          </div>
          {icon && (
            <div className="p-2 bg-primary/10 rounded-lg">
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
