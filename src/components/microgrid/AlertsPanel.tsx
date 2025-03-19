
import React from 'react';
import { AlertTriangle, Check } from 'lucide-react';
import { AlertItem } from './types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface AlertsPanelProps {
  alerts: AlertItem[];
  onAcknowledge: (alertId: string) => void;
}

const AlertsPanel: React.FC<AlertsPanelProps> = ({ alerts, onAcknowledge }) => {
  // Function to format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString() + ', ' + date.toLocaleDateString();
  };

  // Render alert badge
  const renderAlertBadge = (severity: 'low' | 'medium' | 'high') => {
    const colorMap = {
      low: "bg-blue-500",
      medium: "bg-yellow-500",
      high: "bg-red-500"
    };
    
    return (
      <Badge className={`${colorMap[severity]} text-white`}>
        {severity.charAt(0).toUpperCase() + severity.slice(1)}
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader className="bg-red-500/5">
        <CardTitle className="flex items-center text-lg">
          <AlertTriangle className="mr-2 h-5 w-5 text-red-500" />
          Active Alerts
        </CardTitle>
        <CardDescription>
          System warnings and notifications
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-6">
        {alerts.length > 0 ? (
          <div className="space-y-4">
            {alerts.map(alert => (
              <div key={alert.id} className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <div className="mt-0.5">
                  <AlertTriangle className={`h-5 w-5 ${
                    alert.severity === 'high' ? 'text-red-500' : 
                    alert.severity === 'medium' ? 'text-yellow-500' : 
                    'text-blue-500'
                  }`} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <div className="font-medium">{alert.message}</div>
                    {renderAlertBadge(alert.severity)}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {formatDate(alert.timestamp)}
                  </div>
                </div>
                {!alert.acknowledged && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onAcknowledge(alert.id)}
                  >
                    Acknowledge
                  </Button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <Check className="h-12 w-12 text-green-500 mb-2" />
            <h3 className="text-lg font-medium">No Active Alerts</h3>
            <p className="text-sm text-muted-foreground">
              Your microgrid system is operating normally
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AlertsPanel;
