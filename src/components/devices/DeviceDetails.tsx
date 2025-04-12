import React from 'react';
import { Device, useDevices } from '@/contexts/DeviceContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface DeviceDetailsProps {
  device: Device;
}

export function DeviceDetails({ device }: DeviceDetailsProps) {
  const { telemetryData } = useDevices();
  const deviceTelemetry = telemetryData[device.id] || [];

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{device.name}</span>
            <Badge variant={device.status === 'online' ? 'success' : 'secondary'}>
              {device.status}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm font-medium text-gray-500">Device ID</div>
              <div className="mt-1">{device.id}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500">Type</div>
              <div className="mt-1">{device.type}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500">Last Seen</div>
              <div className="mt-1">
                {device.lastSeen
                  ? new Date(device.lastSeen).toLocaleString()
                  : 'Never'}
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500">IP Address</div>
              <div className="mt-1">{device.ipAddress || 'N/A'}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Telemetry</CardTitle>
        </CardHeader>
        <CardContent>
          {deviceTelemetry.length === 0 ? (
            <div className="text-center text-gray-500 py-4">
              No telemetry data available
            </div>
          ) : (
            <div className="space-y-4">
              {deviceTelemetry.slice(0, 5).map((data, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-muted rounded-lg"
                >
                  <div>
                    <div className="font-medium">{data.type}</div>
                    <div className="text-sm text-gray-500">
                      {new Date(data.timestamp).toLocaleString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{data.value}</div>
                    <div className="text-sm text-gray-500">{data.unit}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 