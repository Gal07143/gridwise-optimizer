
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export interface MetricData {
  value: number;
  label: string;
  positive?: boolean;
}

export interface MetricsCardProps {
  title: string;
  metrics: MetricData[];
  icon?: React.ReactNode;
  loading?: boolean;
  className?: string;
}

export const MetricsCard: React.FC<MetricsCardProps> = ({
  title,
  metrics,
  icon,
  loading = false,
  className,
}) => {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-6 w-20" />
            <div className="flex gap-2">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-4 w-12" />
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {metrics.map((metric, index) => (
              <div key={index} className="space-y-0.5">
                <div className="text-xl font-bold">
                  {typeof metric.value === 'number' ? metric.value.toLocaleString() : metric.value}
                </div>
                <div className="flex items-center gap-1 text-xs">
                  <span className="text-muted-foreground">{metric.label}</span>
                  {metric.positive !== undefined && (
                    <span className={cn(
                      "ml-1 font-medium",
                      metric.positive ? "text-green-500" : "text-red-500"
                    )}>
                      {metric.positive ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
