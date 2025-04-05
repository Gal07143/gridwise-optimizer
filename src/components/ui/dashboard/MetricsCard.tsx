
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface MetricValue {
  value: number;
  label: string;
  positive?: boolean;
}

interface MetricsCardProps {
  title: string;
  metrics: MetricValue[];
  className?: string;
  description?: string;
  icon?: React.ReactNode;
  loading?: boolean;
}

const MetricsCard: React.FC<MetricsCardProps> = ({
  title,
  metrics,
  className,
  description,
  icon,
  loading = false,
}) => {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-2">
            <div className="h-4 w-3/4 animate-pulse rounded bg-muted"></div>
            <div className="h-8 w-1/2 animate-pulse rounded bg-muted"></div>
            <div className="h-4 w-full animate-pulse rounded bg-muted"></div>
          </div>
        ) : (
          <div className="space-y-2">
            {description && <p className="text-xs text-muted-foreground">{description}</p>}
            {metrics.map((metric, i) => (
              <div key={i} className="mb-4">
                <div className="flex items-center">
                  <span className="text-xs text-muted-foreground">{metric.label}</span>
                  {metric.positive !== undefined && (
                    <span 
                      className={cn(
                        "ml-1 inline-block rounded px-1 text-xs",
                        metric.positive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      )}
                    >
                      {metric.positive ? "↑" : "↓"}
                    </span>
                  )}
                </div>
                <div className="text-2xl font-bold">{metric.value}</div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export { MetricsCard };
