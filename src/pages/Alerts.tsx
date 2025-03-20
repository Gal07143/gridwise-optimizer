
import React, { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, AlertTriangle, Info, CheckCircle, Filter, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { toast } from 'sonner';

// Mock alert data
const mockAlerts = [
  {
    id: 1,
    title: 'Battery Discharge Rate Exceeding Threshold',
    description: 'The battery discharge rate has exceeded the configured threshold of 5kW for more than 15 minutes.',
    severity: 'critical',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    source: 'Battery Management System',
    read: false,
    acknowledged: false
  },
  {
    id: 2,
    title: 'Solar Panel Efficiency Decreasing',
    description: 'Solar panel array A efficiency has decreased by 15% over the past week. Maintenance check recommended.',
    severity: 'warning',
    timestamp: new Date(Date.now() - 1000 * 60 * 120),
    source: 'Performance Monitoring',
    read: true,
    acknowledged: false
  },
  {
    id: 3,
    title: 'Scheduled Maintenance Reminder',
    description: 'Scheduled maintenance for inverter system is due in 2 days.',
    severity: 'info',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12),
    source: 'Maintenance Scheduler',
    read: true,
    acknowledged: true
  },
  {
    id: 4,
    title: 'Firmware Update Available',
    description: 'A new firmware update (v2.3.5) is available for your energy management system.',
    severity: 'info',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    source: 'System Updates',
    read: false,
    acknowledged: false
  },
  {
    id: 5,
    title: 'Grid Connection Restored',
    description: 'Grid connection has been successfully restored after 45 minutes of disconnection.',
    severity: 'success',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
    source: 'Grid Monitoring',
    read: true,
    acknowledged: true
  }
];

const Alerts = () => {
  const [alerts, setAlerts] = useState(mockAlerts);
  const [activeTab, setActiveTab] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleAcknowledge = (id: number) => {
    setAlerts(alerts.map(alert => 
      alert.id === id ? { ...alert, acknowledged: true } : alert
    ));
    toast.success('Alert acknowledged');
  };

  const handleMarkAsRead = (id: number) => {
    setAlerts(alerts.map(alert => 
      alert.id === id ? { ...alert, read: true } : alert
    ));
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success('Alerts refreshed');
    }, 1000);
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <Badge variant="destructive">Critical</Badge>;
      case 'warning':
        return <Badge className="bg-amber-500">Warning</Badge>;
      case 'info':
        return <Badge variant="secondary">Info</Badge>;
      case 'success':
        return <Badge className="bg-green-500">Success</Badge>;
      default:
        return <Badge variant="secondary">Info</Badge>;
    }
  };

  const filteredAlerts = activeTab === 'all' 
    ? alerts 
    : activeTab === 'unread' 
      ? alerts.filter(alert => !alert.read)
      : activeTab === 'acknowledged'
        ? alerts.filter(alert => alert.acknowledged)
        : alerts.filter(alert => !alert.acknowledged);

  return (
    <AppLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold mb-1">Alerts & Notifications</h1>
            <p className="text-muted-foreground">Monitor and manage system alerts</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
              <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="all">All Alerts</TabsTrigger>
            <TabsTrigger value="unread">Unread</TabsTrigger>
            <TabsTrigger value="unacknowledged">Unacknowledged</TabsTrigger>
            <TabsTrigger value="acknowledged">Acknowledged</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4">
            {filteredAlerts.length > 0 ? (
              filteredAlerts.map(alert => (
                <Card 
                  key={alert.id} 
                  className={`transition-colors ${!alert.read ? 'border-l-4 border-l-primary' : ''}`}
                  onClick={() => handleMarkAsRead(alert.id)}
                >
                  <CardHeader className="py-4">
                    <div className="flex justify-between items-start">
                      <div className="flex items-start space-x-3">
                        {getSeverityIcon(alert.severity)}
                        <div>
                          <div className="flex items-center gap-2">
                            <CardTitle className="text-base">{alert.title}</CardTitle>
                            {getSeverityBadge(alert.severity)}
                            {!alert.read && <Badge variant="outline" className="bg-primary/10">New</Badge>}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {alert.source} • {format(alert.timestamp, 'MMM d, yyyy h:mm a')}
                          </p>
                        </div>
                      </div>
                      {!alert.acknowledged && (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAcknowledge(alert.id);
                          }}
                        >
                          Acknowledge
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0 pb-4">
                    <p className="text-sm text-muted-foreground">{alert.description}</p>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-12">
                <Bell className="mx-auto h-12 w-12 text-muted-foreground opacity-20" />
                <h3 className="mt-4 text-lg font-medium">No alerts found</h3>
                <p className="text-muted-foreground">There are no alerts matching your current filter.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Alerts;
