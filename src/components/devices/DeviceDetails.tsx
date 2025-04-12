import React from 'react';
import { Device, TelemetryData } from '@/contexts/DeviceContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Activity, Clock, AlertTriangle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface DeviceDetailsProps {
  device: Device;
  telemetry?: TelemetryData[];
  isLoading?: boolean;
  className?: string;
}

/**
 * DeviceInfo component for displaying basic device information
 */
const DeviceInfo = ({ device, isLoading }: { device: Device; isLoading?: boolean }) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-28" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">Type</span>
        <span className="font-medium">{device.type}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">Protocol</span>
        <span className="font-medium">{device.protocol}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">MQTT Topic</span>
        <span className="font-medium font-mono">{device.mqtt_topic}</span>
      </div>
      {device.http_endpoint && (
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">HTTP Endpoint</span>
          <span className="font-medium font-mono">{device.http_endpoint}</span>
        </div>
      )}
    </div>
  );
};

/**
 * ConnectionDetails component for displaying connection information
 */
const ConnectionDetails = ({ device, isLoading }: { device: Device; isLoading?: boolean }) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-28" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {device.ip_address && (
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">IP Address</span>
          <span className="font-medium font-mono">{device.ip_address}</span>
        </div>
      )}
      {device.port && (
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Port</span>
          <span className="font-medium">{device.port}</span>
        </div>
      )}
      {device.slave_id && (
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Slave ID</span>
          <span className="font-medium">{device.slave_id}</span>
        </div>
      )}
    </div>
  );
};

/**
 * TelemetryDisplay component for displaying telemetry data
 */
const TelemetryDisplay = ({ telemetry, isLoading }: { telemetry?: TelemetryData[]; isLoading?: boolean }) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  if (!telemetry || telemetry.length === 0) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        No telemetry data available
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {telemetry.map((data, index) => (
        <div 
          key={index} 
          className="flex justify-between items-center p-2 rounded-lg bg-muted/50"
        >
          <div className="flex items-center space-x-2">
            <Activity className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{data.timestamp}</span>
          </div>
          <div className="flex items-center space-x-4">
            {Object.entries(data.data).map(([key, value]) => (
              <div key={key} className="text-sm">
                <span className="text-muted-foreground">{key}:</span>{' '}
                <span className="font-medium">{String(value)}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

/**
 * DeviceDetails component for displaying detailed device information
 * @param device - The device to display details for
 * @param telemetry - Optional array of telemetry data
 * @param isLoading - Optional flag indicating if data is loading
 * @param className - Optional additional CSS classes
 */
export function DeviceDetails({ 
  device, 
  telemetry, 
  isLoading = false,
  className 
}: DeviceDetailsProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{device.name}</CardTitle>
            <CardDescription>
              Device ID: {device.id}
            </CardDescription>
          </div>
          <Badge 
            variant={device.status === 'online' ? 'success' : 'destructive'}
            className="ml-2"
          >
            {device.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="info" className="space-y-4">
          <TabsList>
            <TabsTrigger value="info">Information</TabsTrigger>
            <TabsTrigger value="connection">Connection</TabsTrigger>
            <TabsTrigger value="telemetry">Telemetry</TabsTrigger>
          </TabsList>

          <TabsContent value="info">
            <Card>
              <CardHeader>
                <CardTitle>Device Information</CardTitle>
                <CardDescription>Basic details about the device</CardDescription>
              </CardHeader>
              <CardContent>
                <DeviceInfo device={device} isLoading={isLoading} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="connection">
            <Card>
              <CardHeader>
                <CardTitle>Connection Details</CardTitle>
                <CardDescription>Connection parameters for the device</CardDescription>
              </CardHeader>
              <CardContent>
                <ConnectionDetails device={device} isLoading={isLoading} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="telemetry">
            <Card>
              <CardHeader>
                <CardTitle>Recent Telemetry</CardTitle>
                <CardDescription>Latest data from the device</CardDescription>
              </CardHeader>
              <CardContent>
                <TelemetryDisplay telemetry={telemetry} isLoading={isLoading} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
} 