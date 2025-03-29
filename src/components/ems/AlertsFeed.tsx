
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, AlertTriangle, AlertCircle, Info, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface AlertsFeedProps {
  limit?: number;
}

// Sample alerts data
const sampleAlerts = [
  {
    id: 'alert-1',
    title: 'Battery Low Charge',
    message: 'Battery storage level below 20%. Consider adjusting discharge rate.',
    timestamp: '10 min ago',
    type: 'warning' as const,
  },
  {
    id: 'alert-2',
    title: 'High Power Consumption',
    message: 'Unusual power consumption detected in main circuit.',
    timestamp: '25 min ago',
    type: 'alert' as const,
  },
  {
    id: 'alert-3',
    title: 'Inverter Maintenance',
    message: 'Scheduled maintenance due for inverter system.',
    timestamp: '1 hour ago',
    type: 'info' as const,
  },
  {
    id: 'alert-4',
    title: 'Grid Connection Issue',
    message: 'Intermittent grid connection detected. Switching to island mode.',
    timestamp: '2 hours ago',
    type: 'critical' as const,
  },
  {
    id: 'alert-5',
    title: 'Update Available',
    message: 'System firmware update available for energy controller.',
    timestamp: '3 hours ago',
    type: 'info' as const,
  },
];

const AlertsFeed: React.FC<AlertsFeedProps> = ({ limit }) => {
  const navigate = useNavigate();
  const displayAlerts = limit ? sampleAlerts.slice(0, limit) : sampleAlerts;

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case 'alert':
        return <AlertTriangle className="h-5 w-5 text-orange-500" />;
      case 'info':
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium flex items-center">
          <Bell className="h-5 w-5 mr-2 text-amber-500" />
          Alerts
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {displayAlerts.map((alert) => (
            <div
              key={alert.id}
              className="border-l-4 rounded-r-md p-3 bg-gray-50 dark:bg-gray-800"
              style={{
                borderLeftColor:
                  alert.type === 'critical'
                    ? 'var(--red-500)'
                    : alert.type === 'warning'
                    ? 'var(--amber-500)'
                    : alert.type === 'alert'
                    ? 'var(--orange-500)'
                    : 'var(--blue-500)',
              }}
            >
              <div className="flex items-start">
                <div className="mr-3 mt-0.5">{getAlertIcon(alert.type)}</div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium">{alert.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {alert.message}
                  </p>
                  <div className="text-xs text-muted-foreground mt-2">
                    {alert.timestamp}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {limit && displayAlerts.length === limit && (
          <Button 
            variant="ghost" 
            className="w-full mt-4 text-muted-foreground"
            onClick={() => navigate('/alerts')}
          >
            View All Alerts
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        )}

        {displayAlerts.length === 0 && (
          <div className="text-center py-6">
            <Info className="h-8 w-8 text-muted-foreground mx-auto mb-2 opacity-50" />
            <p className="text-sm text-muted-foreground">No alerts at this time</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AlertsFeed;
