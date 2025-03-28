import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { SystemComponent, SystemEvent, ComponentStatus } from '@/types/system';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatTimestamp } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from 'lucide-react';
import { Alert } from '@/types/alert';

const SystemStatus = () => {
  const [components, setComponents] = useState<SystemComponent[]>([]);
  const [events, setEvents] = useState<SystemEvent[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredComponents, setFilteredComponents] = useState<SystemComponent[]>([]);

  useEffect(() => {
    // Mock data for system components
    const mockComponents: SystemComponent[] = [
      {
        id: 'core-001',
        component_name: 'Core Services',
        status: 'operational',
        details: 'All core services are running smoothly.',
        latency: 25,
        last_restart: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        updated_at: new Date().toISOString()
      },
      {
        id: 'db-001',
        component_name: 'Main Database',
        status: 'operational',
        details: 'Database is online and responding to queries.',
        latency: 15,
        last_restart: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
        updated_at: new Date().toISOString()
      },
      {
        id: 'api-001',
        component_name: 'API Gateway',
        status: 'degraded',
        details: 'Experiencing higher than normal latency.',
        latency: 150,
        last_restart: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
        updated_at: new Date().toISOString()
      },
      {
        id: 'auth-001',
        component_name: 'Authentication Service',
        status: 'operational',
        details: 'Authentication service is functioning normally.',
        latency: 10,
        last_restart: new Date(Date.now() - 86400000).toISOString(), // 24 hours ago
        updated_at: new Date().toISOString()
      },
      {
        id: 'cache-001',
        component_name: 'Cache Server',
        status: 'operational',
        details: 'Cache server is online and serving requests.',
        latency: 5,
        last_restart: new Date(Date.now() - 43200000).toISOString(), // 12 hours ago
        updated_at: new Date().toISOString()
      },
      {
        id: 'mqtt-001',
        component_name: 'MQTT Broker',
        status: 'operational',
        details: 'MQTT broker is online and handling messages.',
        latency: 8,
        last_restart: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        updated_at: new Date().toISOString()
      },
      {
        id: 'ingest-001',
        component_name: 'Data Ingestion Service',
        status: 'operational',
        details: 'Data ingestion service is processing data.',
        latency: 30,
        last_restart: new Date(Date.now() - 900000).toISOString(), // 15 minutes ago
        updated_at: new Date().toISOString()
      },
      {
        id: 'report-001',
        component_name: 'Reporting Service',
        status: 'operational',
        details: 'Reporting service is generating reports.',
        latency: 40,
        last_restart: new Date(Date.now() - 10800000).toISOString(), // 3 hours ago
        updated_at: new Date().toISOString()
      },
      {
        id: 'alert-001',
        component_name: 'Alerting Service',
        status: 'operational',
        details: 'Alerting service is monitoring system health.',
        latency: 12,
        last_restart: new Date(Date.now() - 14400000).toISOString(), // 4 hours ago
        updated_at: new Date().toISOString()
      },
      {
        id: 'ui-001',
        component_name: 'User Interface',
        status: 'operational',
        details: 'User interface is responsive and accessible.',
        latency: 50,
        last_restart: new Date(Date.now() - 5400000).toISOString(), // 1.5 hours ago
        updated_at: new Date().toISOString()
      }
    ];

    // Mock data for system events
    const newEvents: SystemEvent[] = [
      {
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        severity: 'error',
        message: 'Database connection failed - retrying',
        component_id: 'db-001',
        component_name: 'Main Database',
        acknowledged: false,
        title: 'Database Connection Error'
      },
      {
        id: crypto.randomUUID(),
        timestamp: new Date(Date.now() - 60000).toISOString(), // 1 minute ago
        severity: 'warning',
        message: 'High latency detected in API gateway',
        component_id: 'api-001',
        component_name: 'API Gateway',
        acknowledged: false,
        title: 'API Latency Issue'
      },
      {
        id: crypto.randomUUID(),
        timestamp: new Date(Date.now() - 120000).toISOString(), // 2 minutes ago
        severity: 'info',
        message: 'Cache server restarted successfully',
        component_id: 'cache-001',
        component_name: 'Cache Server',
        acknowledged: true,
        title: 'Cache Server Restart'
      },
      {
        id: crypto.randomUUID(),
        timestamp: new Date(Date.now() - 180000).toISOString(), // 3 minutes ago
        severity: 'critical',
        message: 'MQTT Broker is down',
        component_id: 'mqtt-001',
        component_name: 'MQTT Broker',
        acknowledged: false,
        title: 'MQTT Broker Down'
      },
      {
        id: crypto.randomUUID(),
        timestamp: new Date(Date.now() - 240000).toISOString(), // 4 minutes ago
        severity: 'warning',
        message: 'Data Ingestion Service is running slow',
        component_id: 'ingest-001',
        component_name: 'Data Ingestion Service',
        acknowledged: true,
        title: 'Data Ingestion Slow'
      },
      {
        id: crypto.randomUUID(),
        timestamp: new Date(Date.now() - 300000).toISOString(), // 5 minutes ago
        severity: 'info',
        message: 'Reporting Service generated a new report',
        component_id: 'report-001',
        component_name: 'Reporting Service',
        acknowledged: false,
        title: 'New Report Generated'
      },
      {
        id: crypto.randomUUID(),
        timestamp: new Date(Date.now() - 360000).toISOString(), // 6 minutes ago
        severity: 'error',
        message: 'Alerting Service failed to send an email',
        component_id: 'alert-001',
        component_name: 'Alerting Service',
        acknowledged: false,
        title: 'Alerting Service Email Failure'
      },
      {
        id: crypto.randomUUID(),
        timestamp: new Date(Date.now() - 420000).toISOString(), // 7 minutes ago
        severity: 'info',
        message: 'User Interface is updated',
        component_id: 'ui-001',
        component_name: 'User Interface',
        acknowledged: true,
        title: 'UI Updated'
      },
      {
        id: crypto.randomUUID(),
        timestamp: new Date(Date.now() - 480000).toISOString(), // 8 minutes ago
        severity: 'warning',
        message: 'Authentication Service is under heavy load',
        component_id: 'auth-001',
        component_name: 'Authentication Service',
        acknowledged: false,
        title: 'Auth Service Load'
      },
      {
        id: crypto.randomUUID(),
        timestamp: new Date(Date.now() - 540000).toISOString(), // 9 minutes ago
        severity: 'info',
        message: 'Core Services are running smoothly',
        component_id: 'core-001',
        component_name: 'Core Services',
        acknowledged: true,
        title: 'Core Services OK'
      }
    ];

    setComponents(mockComponents);
    setEvents(newEvents);
  }, []);

  useEffect(() => {
    const filtered = components.filter(component =>
      component.component_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      component.details.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredComponents(filtered);
  }, [searchQuery, components]);

  const getStatusBadge = (status: ComponentStatus) => {
    switch (status) {
      case 'operational':
        return <Badge variant="success">Operational</Badge>;
      case 'degraded':
        return <Badge variant="warning">Degraded</Badge>;
      case 'maintenance':
        return <Badge variant="secondary">Maintenance</Badge>;
      case 'down':
        return <Badge variant="destructive">Down</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  const getSeverityBadge = (severity: SystemEvent['severity']) => {
    switch (severity) {
      case 'info':
        return <Badge variant="outline">Info</Badge>;
      case 'warning':
        return <Badge variant="warning">Warning</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      case 'critical':
        return <Badge variant="destructive">Critical</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  return (
    <AppLayout>
      <div className="flex-1 p-6">
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Components</CardTitle>
              <CardDescription>Status of key system components</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex items-center space-x-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Filter components..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-8"
                />
              </div>
              <ScrollArea className="h-[400px] w-full rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[200px]">Component</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Details</TableHead>
                      <TableHead>Latency (ms)</TableHead>
                      <TableHead>Last Restart</TableHead>
                      <TableHead>Updated At</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredComponents.map((component) => (
                      <TableRow key={component.id}>
                        <TableCell className="font-medium">{component.component_name}</TableCell>
                        <TableCell>{getStatusBadge(component.status)}</TableCell>
                        <TableCell>{component.details}</TableCell>
                        <TableCell>{component.latency}</TableCell>
                        <TableCell>{formatTimestamp(component.last_restart)}</TableCell>
                        <TableCell>{formatTimestamp(component.updated_at)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>System Events</CardTitle>
              <CardDescription>Recent system events and logs</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] w-full rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[150px]">Timestamp</TableHead>
                      <TableHead className="w-[120px]">Severity</TableHead>
                      <TableHead>Message</TableHead>
                      <TableHead className="w-[150px]">Component</TableHead>
                      <TableHead className="w-[100px]">Acknowledged</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {events.map((event) => (
                      <TableRow key={event.id}>
                        <TableCell>{formatTimestamp(event.timestamp)}</TableCell>
                        <TableCell>{getSeverityBadge(event.severity)}</TableCell>
                        <TableCell>{event.message}</TableCell>
                        <TableCell>{event.component_name || 'N/A'}</TableCell>
                        <TableCell>{event.acknowledged ? 'Yes' : 'No'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default SystemStatus;
