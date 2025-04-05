
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertCircle, Bell, BellOff, Clock, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AlertItem } from './types';

interface AlertsPanelProps {
  alerts: AlertItem[];
}

const AlertsPanel: React.FC<AlertsPanelProps> = ({ alerts = [] }) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'low':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  
  const formatTimeAgo = (timestamp: string) => {
    const msPerMinute = 60 * 1000;
    const msPerHour = msPerMinute * 60;
    const msPerDay = msPerHour * 24;
    
    const elapsed = Date.now() - new Date(timestamp).getTime();
    
    if (elapsed < msPerMinute) {
      return 'just now';
    } else if (elapsed < msPerHour) {
      return Math.round(elapsed / msPerMinute) + ' min ago';
    } else if (elapsed < msPerDay) {
      return Math.round(elapsed / msPerHour) + ' hours ago';
    } else {
      return Math.round(elapsed / msPerDay) + ' days ago';
    }
  };
  
  return (
    <div className="space-y-2">
      {alerts.length === 0 ? (
        <div className="text-center p-8 border border-dashed rounded-lg">
          <Bell className="mx-auto h-12 w-12 text-gray-300" />
          <p className="mt-2 text-muted-foreground">No alerts to display</p>
        </div>
      ) : (
        <ScrollArea className="h-[400px] pr-4">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`mb-3 p-3 border rounded-md ${getSeverityColor(alert.severity)} ${
                alert.acknowledged ? 'opacity-70' : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-medium">{alert.title}</div>
                    <p className="text-sm">{alert.message}</p>
                    <div className="flex items-center gap-2 mt-1 text-xs">
                      <Clock className="h-3 w-3" />
                      <span>{formatTimeAgo(alert.timestamp)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge variant="outline" className="capitalize">
                    {alert.severity}
                  </Badge>
                  {alert.acknowledged ? (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Acknowledged
                    </Badge>
                  ) : (
                    <Button size="sm" variant="ghost" className="h-7 px-2">
                      <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                      Acknowledge
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </ScrollArea>
      )}
    </div>
  );
};

export default AlertsPanel;
