
import React from 'react';
import { Info, AlertTriangle, XCircle } from 'lucide-react';
import { SystemEvent } from '@/types/system';

interface EventItemProps {
  event: SystemEvent;
}

export const EventItem: React.FC<EventItemProps> = ({ event }) => {
  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'info':
        return <Info className="h-4 w-4 text-blue-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  return (
    <div className="flex p-3 border rounded-md bg-card">
      <div className="mr-3">
        {getSeverityIcon(event.severity)}
      </div>
      <div className="flex-1">
        <div className="flex justify-between">
          <span className="font-medium">{event.message}</span>
          <span className="text-xs text-muted-foreground">
            {new Date(event.timestamp).toLocaleString()}
          </span>
        </div>
        <div className="text-sm text-muted-foreground mt-1">
          Component: {event.component_name || 'System'}
        </div>
      </div>
    </div>
  );
};
