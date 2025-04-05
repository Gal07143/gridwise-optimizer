
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

export interface MetricsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    label: string;
    positive?: boolean;
  };
  onClick?: () => void;
  className?: string;
  isLoading?: boolean;
}

const MetricsCard: React.FC<MetricsCardProps> = ({
  title,
  value,
  description,
  icon,
  trend,
  onClick,
  className = '',
  isLoading = false
}) => {
  if (isLoading) {
    return (
      <Card className={`overflow-hidden ${className} ${onClick ? 'cursor-pointer hover:bg-accent/50 transition-colors' : ''}`} onClick={onClick}>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center">
            {icon && <span className="mr-2">{icon}</span>}
            <div className="h-4 w-24 bg-secondary rounded animate-pulse"></div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-8 w-20 bg-secondary rounded animate-pulse mb-1"></div>
          <div className="h-3 w-32 bg-secondary rounded animate-pulse opacity-50"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card 
      className={`overflow-hidden ${className} ${onClick ? 'cursor-pointer hover:bg-accent/50 transition-colors' : ''}`} 
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center">
          {icon && <span className="mr-2">{icon}</span>}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
        {trend && (
          <div className="flex items-center mt-2 text-xs">
            <span className={trend.positive ? 'text-green-500' : 'text-red-500'}>
              {trend.positive ? '↑' : '↓'} {Math.abs(trend.value)}%
            </span>
            <span className="ml-1 text-muted-foreground">{trend.label}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MetricsCard;
