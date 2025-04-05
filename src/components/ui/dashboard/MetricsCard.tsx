
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cva } from 'class-variance-authority';

export interface MetricItem {
  value: number;
  label: string;
  positive?: boolean;
}

export interface MetricsCardProps {
  title: string;
  icon?: React.ReactNode;
  metrics: MetricItem[];
  loading?: boolean;
  error?: Error | null;
  className?: string;
}

const valueVariants = cva("text-3xl font-semibold", {
  variants: {
    trend: {
      positive: "text-green-600 dark:text-green-500",
      negative: "text-red-600 dark:text-red-500",
      neutral: "text-foreground",
    }
  },
  defaultVariants: {
    trend: "neutral"
  }
});

export function MetricsCard({ title, icon, metrics, loading = false, error, className }: MetricsCardProps) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ) : error ? (
          <div className="text-sm text-red-500">Failed to load data</div>
        ) : (
          <div className="space-y-1">
            {metrics.map((metric, index) => (
              <div key={index} className="space-y-0.5">
                <div className={valueVariants({ trend: metric.positive ? "positive" : "neutral" })}>
                  {typeof metric.value === 'number' ? metric.value.toLocaleString() : metric.value}
                </div>
                <p className="text-xs text-muted-foreground">{metric.label}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default MetricsCard;
