
import React from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent 
} from '@/components/ui/card';
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge-extended';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { AlertItem } from '@/components/microgrid/types';

export interface AlertsPanelProps {
  alerts: AlertItem[];
  onAcknowledge: (alertId: string) => void;
}

const AlertsPanel: React.FC<AlertsPanelProps> = ({ 
  alerts,
  onAcknowledge
}) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          System Alerts
        </CardTitle>
      </CardHeader>
      <CardContent>
        {alerts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No active alerts
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>Alert</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {alerts.map((alert) => (
                <TableRow key={alert.id}>
                  <TableCell className="text-xs">
                    {new Date(alert.timestamp).toLocaleTimeString()}
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{alert.title}</div>
                    <div className="text-xs text-muted-foreground">{alert.message}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getSeverityColor(alert.severity)}>
                      {alert.severity}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {alert.acknowledged ? (
                      <Badge variant="success">Acknowledged</Badge>
                    ) : (
                      <Badge variant="outline">New</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {!alert.acknowledged && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => onAcknowledge(alert.id)}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Acknowledge
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default AlertsPanel;
