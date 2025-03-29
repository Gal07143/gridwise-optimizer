
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, AlertTriangle, Info, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useSiteContext } from '@/contexts/SiteContext';

// Mock alerts data
const mockAlerts = [
  {
    id: 'alert-1',
    title: 'Battery level low',
    message: 'Battery storage reached 20% capacity',
    severity: 'warning',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    acknowledged: false
  },
  {
    id: 'alert-2',
    title: 'Grid connection lost',
    message: 'Connection to grid was interrupted',
    severity: 'critical',
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    acknowledged: true
  },
  {
    id: 'alert-3',
    title: 'Optimal charging time',
    message: 'Current electricity prices are at daily minimum',
    severity: 'info',
    timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(), 
    acknowledged: false
  },
  {
    id: 'alert-4',
    title: 'Solar panel maintenance',
    message: 'Scheduled maintenance reminder for solar array',
    severity: 'low',
    timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    acknowledged: false
  }
];

const AlertsFeed = () => {
  const { activeSite } = useSiteContext();
  const [alerts, setAlerts] = useState(mockAlerts);
  
  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case 'info':
        return <Info className="h-4 w-4 text-blue-500" />;
      case 'low':
        return <Info className="h-4 w-4 text-green-500" />;
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <Badge variant="destructive">Critical</Badge>;
      case 'warning':
        return <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">Warning</Badge>;
      case 'info':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">Info</Badge>;
      case 'low':
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Low</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffMins < 1440) {
      return `${Math.floor(diffMins / 60)}h ago`;
    } else {
      return `${Math.floor(diffMins / 1440)}d ago`;
    }
  };

  const handleAcknowledge = (alertId: string) => {
    setAlerts(alerts.map(alert => 
      alert.id === alertId ? { ...alert, acknowledged: true } : alert
    ));
  };
  
  return (
    <Card className="shadow-md h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium flex items-center">
          <Bell className="h-5 w-5 mr-2 text-amber-500" />
          Alerts Feed
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
          {alerts.length > 0 ? (
            alerts.map(alert => (
              <div 
                key={alert.id} 
                className={`p-3 border rounded-lg flex items-start gap-3 ${
                  alert.acknowledged ? 'bg-gray-50 dark:bg-gray-800/50' : 'bg-white dark:bg-gray-800'
                }`}
              >
                <div className="flex-shrink-0 mt-1">
                  {getSeverityIcon(alert.severity)}
                </div>
                <div className="flex-grow min-w-0">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium text-sm line-clamp-1">{alert.title}</h4>
                    <div className="flex-shrink-0 ml-2">
                      {getSeverityBadge(alert.severity)}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {alert.message}
                  </p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-muted-foreground">
                      {formatTimestamp(alert.timestamp)}
                    </span>
                    {!alert.acknowledged && (
                      <button 
                        onClick={() => handleAcknowledge(alert.id)}
                        className="text-xs flex items-center text-blue-600 hover:text-blue-800"
                      >
                        <Check className="h-3 w-3 mr-1" /> Acknowledge
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-muted-foreground">
              No alerts at this time
            </div>
          )}
        </div>
        
        <div className="mt-4 text-sm text-muted-foreground">
          {activeSite ? `Showing alerts for ${activeSite.name}` : 'Select a site to view alerts'}
        </div>
      </CardContent>
    </Card>
  );
};

export default AlertsFeed;
