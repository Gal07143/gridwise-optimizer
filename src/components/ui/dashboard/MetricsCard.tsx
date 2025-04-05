
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export interface MetricData {
  value: number;
  label: string;
  positive?: boolean;
}

export interface MetricsCardProps {
  title: string;
  description?: string;
  metric: MetricData;
  trend?: MetricData;
  icon?: React.ReactNode;
  loading?: boolean;
  footer?: React.ReactNode;
  className?: string;
}

export const MetricsCard: React.FC<MetricsCardProps> = ({
  title,
  description,
  metric,
  trend,
  icon,
  loading = false,
  footer,
  className,
}) => {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </div>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-4 w-16" />
          </div>
        ) : (
          <>
            <div className="text-2xl font-bold">
              {typeof metric.value === 'number' 
                ? metric.value.toLocaleString() 
                : metric.value}
              <span className="text-xs font-normal text-muted-foreground ml-1">
                {metric.label}
              </span>
            </div>
            
            {trend && (
              <p className="text-xs text-muted-foreground">
                <span className={cn(
                  trend.positive ? "text-green-600" : "text-red-600",
                  "font-medium"
                )}>
                  {trend.value >= 0 ? "+" : ""}{trend.value}%
                </span>{" "}
                {trend.label}
              </p>
            )}
          </>
        )}
      </CardContent>
      {footer && <CardFooter>{footer}</CardFooter>}
    </Card>
  );
};

export default MetricsCard;
