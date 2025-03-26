
import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { formatTimestamp } from '@/lib/utils';
import { getRecentAlerts } from '@/services/alertService';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface Alert {
  id: string;
  timestamp: string;
  source: string;
  message: string;
  severity: 'info' | 'warning' | 'critical';
  resolved: boolean;
}

// Define severity styles consistently
const severityStyles = {
  info: {
    bg: 'bg-blue-100 dark:bg-blue-900/20',
    text: 'text-blue-600 dark:text-blue-400',
    border: 'border-blue-200 dark:border-blue-800/30',
    badge: 'bg-blue-500'
  },
  warning: {
    bg: 'bg-amber-100 dark:bg-amber-900/20',
    text: 'text-amber-600 dark:text-amber-400',
    border: 'border-amber-200 dark:border-amber-800/30',
    badge: 'bg-amber-500'
  },
  critical: {
    bg: 'bg-red-100 dark:bg-red-900/20',
    text: 'text-red-600 dark:text-red-400',
    border: 'border-red-200 dark:border-red-800/30',
    badge: 'bg-red-500'
  }
};

const AlertTable: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        setLoading(true);
        const data = await getRecentAlerts();
        setAlerts(data);
      } catch (error) {
        console.error('Failed to fetch alerts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
    const interval = setInterval(fetchAlerts, 10000); // Refresh every 10s
    return () => clearInterval(interval);
  }, []);

  if (loading) {
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
            {[...Array(5)].map((_, index) => (
              <TableRow key={index}>
                <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                <TableCell><Skeleton className="h-6 w-32" /></TableCell>
                <TableCell><Skeleton className="h-6 w-28" /></TableCell>
                <TableCell><Skeleton className="h-6 w-full" /></TableCell>
                <TableCell><Skeleton className="h-6 w-20" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

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
          {alerts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                No alerts found
              </TableCell>
            </TableRow>
          ) : (
            alerts.map((alert) => (
              <TableRow key={alert.id}>
                <TableCell>
                  <span className={cn(
                    'px-2 py-1 rounded-md text-xs font-semibold',
                    severityStyles[alert.severity].bg,
                    severityStyles[alert.severity].text
                  )}>
                    {alert.severity.toUpperCase()}
                  </span>
                </TableCell>
                <TableCell>{formatTimestamp(alert.timestamp)}</TableCell>
                <TableCell>{alert.source}</TableCell>
                <TableCell>{alert.message}</TableCell>
                <TableCell>
                  <Badge variant={alert.resolved ? 'outline' : 'destructive'}>
                    {alert.resolved ? 'Resolved' : 'Active'}
                  </Badge>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AlertTable;
