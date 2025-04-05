
import React, { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface MetricsCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon?: ReactNode;
  description?: string;
  trend?: number;
  trendDescription?: string;
  isPositiveTrend?: boolean;
  className?: string;
  onClick?: () => void;
  footer?: ReactNode;
}

const MetricsCard: React.FC<MetricsCardProps> = ({
  title,
  value,
  unit,
  icon,
  description,
  trend,
  trendDescription,
  isPositiveTrend = true,
  className,
  onClick,
  footer
}) => {
  return (
    <Card 
      className={cn(
        "overflow-hidden transition-all hover:border-primary/50", 
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {value}
          {unit && <span className="text-base ml-1 font-normal text-muted-foreground">{unit}</span>}
        </div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
        {trend !== undefined && (
          <div className="flex items-center mt-2">
            <span className={cn(
              "text-xs font-medium",
              isPositiveTrend ? "text-green-600" : "text-red-600"
            )}>
              {trend > 0 ? "+" : ""}{trend}%
            </span>
            {trendDescription && (
              <span className="text-xs text-muted-foreground ml-2">
                {trendDescription}
              </span>
            )}
          </div>
        )}
        {footer && <div className="mt-3">{footer}</div>}
      </CardContent>
    </Card>
  );
};

export default MetricsCard;
