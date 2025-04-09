
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, AlertTriangle, AlertCircle, CheckCircle } from 'lucide-react';
import { Alert } from '@/types/energy';

interface SystemAlertsWidgetProps {
  alerts: Alert[];
  className?: string;
}

const getSeverityIcon = (severity: string) => {
  switch (severity.toLowerCase()) {
    case 'critical':
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    case 'high':
      return <AlertTriangle className="h-4 w-4 text-orange-500" />;
    case 'medium':
      return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    case 'low':
      return <Bell className="h-4 w-4 text-blue-500" />;
    case 'info':
      return <CheckCircle className="h-4 w-4 text-gray-500" />;
    default:
      return <Bell className="h-4 w-4 text-gray-500" />;
  }
};

const getSeverityClass = (severity: string) => {
  switch (severity.toLowerCase()) {
    case 'critical':
      return 'bg-red-100 text-red-800';
    case 'high':
      return 'bg-orange-100 text-orange-800';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800';
    case 'low':
      return 'bg-blue-100 text-blue-800';
    case 'info':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const formatAlertTime = (timestamp: string) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.round(diffMs / 60000);
  const diffHours = Math.round(diffMs / 3600000);
  const diffDays = Math.round(diffMs / 86400000);
  
  if (diffMins < 60) {
    return `${diffMins}m ago`;
  } else if (diffHours < 24) {
    return `${diffHours}h ago`;
  } else if (diffDays === 1) {
    return 'Yesterday';
  } else {
    return `${diffDays}d ago`;
  }
};

const SystemAlertsWidget = ({ alerts = [], className = '' }: SystemAlertsWidgetProps) => {
  // Sort alerts by severity and timestamp
  const sortedAlerts = [...alerts].sort((a, b) => {
    const severityOrder: Record<string, number> = {
      'critical': 0,
      'high': 1,
      'medium': 2,
      'low': 3,
      'info': 4
    };
    
    const severityA = severityOrder[a.severity.toLowerCase()] || 999;
    const severityB = severityOrder[b.severity.toLowerCase()] || 999;
    
    // First compare by severity
    if (severityA !== severityB) {
      return severityA - severityB;
    }
    
    // If same severity, sort by timestamp (newest first)
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });
  
  // Count unacknowledged alerts
  const unacknowledgedCount = alerts.filter(alert => !alert.acknowledged).length;
  
  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="flex justify-between items-center">
          System Alerts
          {unacknowledgedCount > 0 && (
            <span className="bg-red-500 text-white text-xs py-1 px-2 rounded-full">
              {unacknowledgedCount} new
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
          {sortedAlerts.slice(0, 5).map(alert => (
            <div key={alert.id} className={`border-l-2 pl-3 ${
              !alert.acknowledged ? 'border-red-500' : 'border-gray-300'
            }`}>
              <div className="flex justify-between">
                <div className="flex items-center">
                  {getSeverityIcon(alert.severity)}
                  <span className="ml-2 font-medium">{alert.message}</span>
                </div>
                <span className={`text-xs py-0.5 px-2 rounded-full ${getSeverityClass(alert.severity)}`}>
                  {alert.severity}
                </span>
              </div>
              <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                <span>Device: {alert.device_id.substring(0, 8)}...</span>
                <span>{formatAlertTime(alert.timestamp)}</span>
              </div>
            </div>
          ))}
          
          {alerts.length > 5 && (
            <div className="text-center text-sm text-muted-foreground pt-2">
              +{alerts.length - 5} more alerts
            </div>
          )}
          
          {alerts.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No active alerts
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemAlertsWidget;
