import React, { useState, useEffect } from 'react';
import { Main } from '@/components/ui/main';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RefreshCw, AlertTriangle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from "@/components/ui/use-toast"
import {
  SystemComponent,
  SystemEvent,
  ComponentStatus,
  SystemEventSeverity
} from '@/types/system';
import { formatTimestamp } from '@/lib/utils';

const mockComponents: SystemComponent[] = [
  {
    id: 'comp-1',
    component_name: 'Inverter',
    status: 'operational',
    details: 'Running normally',
    latency: 2,
    last_restart: new Date(Date.now() - 3600000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'comp-2',
    component_name: 'Battery System',
    status: 'degraded',
    details: 'Capacity reduced',
    latency: 5,
    last_restart: new Date(Date.now() - 7200000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'comp-3',
    component_name: 'Solar Array',
    status: 'operational',
    details: 'Producing at 90%',
    latency: 1,
    last_restart: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'comp-4',
    component_name: 'Grid Connection',
    status: 'maintenance',
    details: 'Scheduled maintenance',
    latency: 10,
    last_restart: new Date(Date.now() - 172800000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'comp-5',
    component_name: 'Energy Management System',
    status: 'operational',
    details: 'Optimizing energy flow',
    latency: 3,
    last_restart: new Date(Date.now() - 604800000).toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const mockEvents: SystemEvent[] = [
  {
    id: 'event-1',
    timestamp: new Date(Date.now() - 60000).toISOString(),
    severity: 'info',
    message: 'System started successfully',
    component_id: 'comp-1',
    component_name: 'Inverter',
    acknowledged: false,
    title: 'System Boot'
  },
  {
    id: 'event-2',
    timestamp: new Date(Date.now() - 120000).toISOString(),
    severity: 'warning',
    message: 'Battery capacity reduced by 10%',
    component_id: 'comp-2',
    component_name: 'Battery System',
    acknowledged: false,
    title: 'Capacity Alert'
  },
  {
    id: 'event-3',
    timestamp: new Date(Date.now() - 180000).toISOString(),
    severity: 'error',
    message: 'Solar array output below expected',
    component_id: 'comp-3',
    component_name: 'Solar Array',
    acknowledged: false,
    title: 'Production Issue'
  },
  {
    id: 'event-4',
    timestamp: new Date(Date.now() - 240000).toISOString(),
    severity: 'info',
    message: 'Grid connection maintenance started',
    component_id: 'comp-4',
    component_name: 'Grid Connection',
    acknowledged: true,
    title: 'Maintenance Start'
  },
  {
    id: 'event-5',
    timestamp: new Date(Date.now() - 300000).toISOString(),
    severity: 'critical',
    message: 'Critical system failure',
    component_id: 'comp-5',
    component_name: 'Energy Management System',
    acknowledged: false,
    title: 'System Failure'
  },
];

const SystemStatus: React.FC = () => {
  const [components, setComponents] = useState<SystemComponent[]>([]);
  const [events, setEvents] = useState<SystemEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Simulate fetching data
    const fetchData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay
      setComponents(mockComponents);
      setEvents(mockEvents);
      setLoading(false);
    };

    fetchData();

    // Refresh data every 30 seconds
    const intervalId = setInterval(fetchData, 30000);
    return () => clearInterval(intervalId);
  }, []);

  const handleRefresh = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate refresh delay
    setComponents(mockComponents);
    setEvents(mockEvents);
    setLoading(false);
    toast({
      title: "System status refreshed.",
      description: "The component and event data has been updated.",
    })
  };

  // Update the BadgeVariant function to map to valid variants
  const getBadgeVariant = (status: ComponentStatus): "default" | "destructive" | "outline" | "secondary" => {
    switch (status) {
      case 'operational':
        return 'secondary'; // Instead of 'success'
      case 'degraded':
        return 'default'; // Instead of 'warning'
      case 'maintenance':
        return 'outline';
      case 'down':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  // Update event severity badges
  const getEventBadgeVariant = (severity: SystemEventSeverity): "default" | "destructive" | "outline" | "secondary" => {
    switch (severity) {
      case 'info':
        return 'secondary';
      case 'warning':
        return 'default'; // Instead of 'warning'
      case 'error':
        return 'destructive';
      case 'critical':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  return (
    <Main title="System Status">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">System Components</CardTitle>
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={loading}>
            {loading ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                </div>
              ))}
            </div>
          ) : components.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Component</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead>Latency (ms)</TableHead>
                  <TableHead>Last Restart</TableHead>
                  <TableHead>Last Update</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {components.map((component) => (
                  <TableRow key={component.id}>
                    <TableCell className="font-medium">{component.component_name}</TableCell>
                    <TableCell>
                      <Badge variant={getBadgeVariant(component.status)}>
                        {component.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{component.details}</TableCell>
                    <TableCell>{component.latency}</TableCell>
                    <TableCell>{formatTimestamp(component.last_restart)}</TableCell>
                    <TableCell>{formatTimestamp(component.updated_at)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex items-center justify-center h-32 text-muted-foreground">
              No components found.
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">System Events</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                </div>
              ))}
            </div>
          ) : events.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Time</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Component</TableHead>
                  <TableHead>Message</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell>{formatTimestamp(event.timestamp)}</TableCell>
                    <TableCell>
                      <Badge variant={getEventBadgeVariant(event.severity)}>
                        {event.severity}
                      </Badge>
                    </TableCell>
                    <TableCell>{event.component_name}</TableCell>
                    <TableCell>{event.message}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex items-center justify-center h-32 text-muted-foreground">
              No events found.
            </div>
          )}
        </CardContent>
      </Card>
    </Main>
  );
};

export default SystemStatus;
