
import React, { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface StatusCardProps {
  title: string;
  status: 'healthy' | 'degraded' | 'critical' | 'maintenance' | 'unknown';
  icon?: ReactNode;
  metric?: string;
  description?: string;
  className?: string;
}

export const StatusCard: React.FC<StatusCardProps> = ({
  title,
  status,
  icon,
  metric,
  description,
  className
}) => {
  const getStatusColor = () => {
    switch (status) {
      case 'healthy': return 'bg-green-500';
      case 'degraded': return 'bg-yellow-500';
      case 'critical': return 'bg-red-500';
      case 'maintenance': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'healthy': return 'Healthy';
      case 'degraded': return 'Degraded';
      case 'critical': return 'Critical';
      case 'maintenance': return 'Maintenance';
      default: return 'Unknown';
    }
  };

  const getStatusBgClass = () => {
    switch (status) {
      case 'healthy': return 'bg-green-50 dark:bg-green-900/20';
      case 'degraded': return 'bg-yellow-50 dark:bg-yellow-900/20';
      case 'critical': return 'bg-red-50 dark:bg-red-900/20';
      case 'maintenance': return 'bg-blue-50 dark:bg-blue-900/20';
      default: return 'bg-gray-50 dark:bg-gray-900/20';
    }
  };

  return (
    <Card className={cn("overflow-hidden", className, getStatusBgClass())}>
      <div className={`h-1 ${getStatusColor()}`} />
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              {icon && <div className="p-2 bg-primary/10 rounded-full">{icon}</div>}
              <h3 className="font-medium text-sm">{title}</h3>
            </div>
            {metric && (
              <div className="text-2xl font-bold">{metric}</div>
            )}
            {description && (
              <div className="text-xs text-muted-foreground mt-1">{description}</div>
            )}
          </div>
          <Badge className={getStatusColor()}>{getStatusText()}</Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatusCard;
