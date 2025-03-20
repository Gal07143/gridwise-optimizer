
import React from 'react';
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertItem } from './types';
import { BadgeExtended } from '@/components/ui/badge-extended';
import { Bell, CheckCircle2 } from 'lucide-react';

interface AlertsPanelProps {
  alerts: AlertItem[];
  onAcknowledge: (alertId: string) => void;
}

const AlertsPanel: React.FC<AlertsPanelProps> = ({ alerts, onAcknowledge }) => {
  // Filter alerts to show unacknowledged first
  const sortedAlerts = [...alerts].sort((a, b) => {
    // Sort by acknowledged status first
    if (a.acknowledged !== b.acknowledged) {
      return a.acknowledged ? 1 : -1;
    }
    
    // Then sort by severity
    const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    return severityOrder[a.severity as keyof typeof severityOrder] - 
           severityOrder[b.severity as keyof typeof severityOrder];
  });

  // Get badge variant based on alert severity
  const getSeverityVariant = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'destructive';
      case 'high':
        return 'destructive';
      case 'medium':
        return 'secondary';
      case 'low':
      default:
        return 'outline';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>System Alerts</span>
          <BadgeExtended variant="secondary">
            {alerts.filter(a => !a.acknowledged).length}/{alerts.length}
          </BadgeExtended>
        </CardTitle>
        <CardDescription>Recent system events and notifications</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedAlerts.length === 0 ? (
            <div className="text-center p-4 text-muted-foreground">
              <p>No alerts to display</p>
            </div>
          ) : (
            sortedAlerts.map((alert) => (
              <div 
                key={alert.id}
                className={`p-3 border rounded-lg ${
                  alert.acknowledged ? 'bg-muted/50' : 'bg-background border-border'
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <div className="flex items-center gap-2">
                    <BadgeExtended 
                      variant={getSeverityVariant(alert.severity)} 
                      className="uppercase text-[10px]"
                    >
                      {alert.severity}
                    </BadgeExtended>
                    <h4 className={`text-sm font-medium ${
                      alert.acknowledged ? 'text-muted-foreground' : ''
                    }`}>
                      {alert.title}
                    </h4>
                  </div>
                  
                  {!alert.acknowledged && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6"
                      onClick={() => onAcknowledge(alert.id)}
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      <span className="sr-only">Acknowledge</span>
                    </Button>
                  )}
                </div>
                
                <p className={`text-sm ${
                  alert.acknowledged ? 'text-muted-foreground' : ''
                }`}>
                  {alert.message}
                </p>
                
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-muted-foreground">
                    {new Date(alert.timestamp).toLocaleString()}
                  </span>
                  
                  {alert.acknowledged && (
                    <span className="text-xs text-muted-foreground flex items-center">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Acknowledged
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AlertsPanel;
