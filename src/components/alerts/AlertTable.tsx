import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { formatTimestamp } from '@/lib/utils';
import { getRecentAlerts } from '@/services/alertService';

interface Alert {
  id: string;
  timestamp: string;
  source: string;
  message: string;
  severity: 'info' | 'warning' | 'critical';
  resolved: boolean;
}

const severityColorMap = {
  info: 'bg-blue-100 text-blue-600',
  warning: 'bg-yellow-100 text-yellow-600',
  critical: 'bg-red-100 text-red-600',
};

const AlertTable: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    const fetchAlerts = async () => {
      const data = await getRecentAlerts();
      setAlerts(data);
    };

    fetchAlerts();
    const interval = setInterval(fetchAlerts, 10000); // Refresh every 10s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="rounded-md border bg-background shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Severity</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Source</TableHead>
            <TableHead>Message</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {alerts.map((alert) => (
            <TableRow key={alert.id}>
              <TableCell>
                <span className={`px-2 py-1 rounded-md text-xs font-semibold ${severityColorMap[alert.severity]}`}>
                  {alert.severity.toUpperCase()}
                </span>
              </TableCell>
              <TableCell>{formatTimestamp(alert.timestamp)}</TableCell>
              <TableCell>{alert.source}</TableCell>
              <TableCell>{alert.message}</TableCell>
              <TableCell>
                <Badge variant={alert.resolved ? 'default' : 'destructive'}>
                  {alert.resolved ? 'Resolved' : 'Active'}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AlertTable;
