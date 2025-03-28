
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
      case 'healthy': return 'bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-900/20 dark:to-green-800/10';
      case 'degraded': return 'bg-gradient-to-br from-yellow-50 to-yellow-100/50 dark:from-yellow-900/20 dark:to-yellow-800/10';
      case 'critical': return 'bg-gradient-to-br from-red-50 to-red-100/50 dark:from-red-900/20 dark:to-red-800/10';
      case 'maintenance': return 'bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/10';
      default: return 'bg-gradient-to-br from-gray-50 to-gray-100/50 dark:from-gray-900/20 dark:to-gray-800/10';
    }
  };

  const getBorderClass = () => {
    switch (status) {
      case 'healthy': return 'border-green-200 dark:border-green-900/30';
      case 'degraded': return 'border-yellow-200 dark:border-yellow-900/30';
      case 'critical': return 'border-red-200 dark:border-red-900/30';
      case 'maintenance': return 'border-blue-200 dark:border-blue-900/30';
      default: return 'border-gray-200 dark:border-gray-900/30';
    }
  };

  const getIconBgClass = () => {
    switch (status) {
      case 'healthy': return 'bg-green-100 dark:bg-green-900/30';
      case 'degraded': return 'bg-yellow-100 dark:bg-yellow-900/30';
      case 'critical': return 'bg-red-100 dark:bg-red-900/30';
      case 'maintenance': return 'bg-blue-100 dark:bg-blue-900/30';
      default: return 'bg-gray-100 dark:bg-gray-900/30';
    }
  };

  return (
    <Card className={cn("overflow-hidden transition-all duration-300 hover-scale", className, getStatusBgClass(), getBorderClass())}>
      <div className={`h-1 ${getStatusColor()}`} />
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              {icon && <div className={cn("p-2 rounded-full", getIconBgClass())}>{icon}</div>}
              <h3 className="font-medium text-sm">{title}</h3>
            </div>
            {metric && (
              <div className="text-2xl font-bold">{metric}</div>
            )}
            {description && (
              <div className="text-xs text-muted-foreground mt-1">{description}</div>
            )}
          </div>
          <Badge className={cn("shadow-sm", getStatusColor())}>{getStatusText()}</Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatusCard;
