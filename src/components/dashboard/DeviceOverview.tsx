
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { TelemetryData } from '@/types/telemetry';
import { Device } from '@/types/device';
import { LineChart, ChartContainer } from '@/components/ui/chart';
import { formattedDate } from '@/lib/utils';
import { useDevices } from '@/hooks/useDevices';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { DeviceParameter } from '@/types/ui';
import { Shield, RefreshCw } from 'lucide-react';

interface DeviceOverviewProps {
  deviceId: string;
  deviceName?: string;
}

export const DeviceOverview: React.FC<DeviceOverviewProps> = ({ deviceId, deviceName }) => {
  const { devices, loading, error, deviceTelemetry } = useDevices();
  const [device, setDevice] = useState<Device | null>(null);
  const [telemetry, setTelemetry] = useState<TelemetryData[]>([]);
  const params = useParams<{ deviceId: string }>();

  // Use the deviceId from props or from the URL params
  const currentDeviceId = deviceId || params.deviceId || '';

  useEffect(() => {
    if (!loading && devices) {
      const foundDevice = devices.find(d => d.id === currentDeviceId);
      if (foundDevice) {
        setDevice(foundDevice);
      }
    }
  }, [currentDeviceId, devices, loading]);

  useEffect(() => {
    if (deviceTelemetry && currentDeviceId && deviceTelemetry[currentDeviceId]) {
      setTelemetry(deviceTelemetry[currentDeviceId]);
    }
  }, [currentDeviceId, deviceTelemetry]);

  if (loading) {
    return <div>Loading device data...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!device) {
    return <div>Device not found</div>;
  }

  // Get the most recent telemetry data
  const latestTelemetry = telemetry.length > 0 ? telemetry[telemetry.length - 1] : null;

  // Create device parameter cards
  const deviceParameters: DeviceParameter[] = [
    { name: 'Status', value: device.status || 'Unknown', key: 'status' },
    { name: 'Last Updated', value: device.last_updated ? formattedDate(device.last_updated) : 'N/A', key: 'last-updated' },
    { name: 'Type', value: device.type || 'Unknown', key: 'type' },
    { name: 'Location', value: device.location || 'Not specified', key: 'location' },
  ];

  // Create telemetry parameter cards if we have telemetry data
  const telemetryParameters: DeviceParameter[] = latestTelemetry
    ? [
        { name: 'Power', value: latestTelemetry.power?.toString() || '0', unit: 'kW', key: 'power' },
        { name: 'Energy', value: latestTelemetry.energy?.toString() || '0', unit: 'kWh', key: 'energy' },
        { name: 'Voltage', value: latestTelemetry.voltage?.toString() || '0', unit: 'V', key: 'voltage' },
        { name: 'Current', value: latestTelemetry.current?.toString() || '0', unit: 'A', key: 'current' },
      ]
    : [];

  // Prepare chart data from telemetry
  const chartData = telemetry.slice(-24).map(t => ({
    time: new Date(t.timestamp).toLocaleTimeString(),
    power: t.power || 0,
  }));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">{deviceName || device.name}</h1>
          <p className="text-muted-foreground">ID: {device.id}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Data
          </Button>
          <Button variant="outline" size="sm">
            <Shield className="h-4 w-4 mr-2" />
            Device Security
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Device Information */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Device Information</CardTitle>
            <CardDescription>Basic device properties and status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {deviceParameters.map((param) => (
                <div key={param.key} className="flex justify-between items-center border-b pb-2">
                  <span className="text-sm font-medium text-muted-foreground">{param.name}</span>
                  <span className="font-medium">{param.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Telemetry Data */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Current Readings</CardTitle>
            <CardDescription>Latest telemetry data from this device</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {telemetryParameters.length > 0 ? (
                telemetryParameters.map((param) => (
                  <div key={param.key} className="bg-secondary/20 p-4 rounded-lg">
                    <div className="text-sm font-medium text-muted-foreground">{param.name}</div>
                    <div className="text-2xl font-bold">
                      {param.value}
                      {param.unit && <span className="text-sm font-normal ml-1">{param.unit}</span>}
                    </div>
                  </div>
                ))
              ) : (
                Array(4)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="bg-secondary/20 p-4 rounded-lg">
                      <Skeleton className="h-4 w-20 mb-2" />
                      <Skeleton className="h-8 w-16" />
                    </div>
                  ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Power Consumption Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Power Consumption</CardTitle>
          <CardDescription>Last 24 hours of power readings</CardDescription>
        </CardHeader>
        <CardContent>
          {chartData.length > 0 ? (
            <ChartContainer>
              <LineChart
                data={chartData}
                xKey="time"
                yKey="power"
                lineColor="hsl(var(--primary))"
                showGrid={true}
                showTooltip={true}
              />
            </ChartContainer>
          ) : (
            <div className="h-72 flex items-center justify-center bg-muted/20 rounded-md">
              <p className="text-muted-foreground">No telemetry data available</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
