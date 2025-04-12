import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDevices } from '@/contexts/DeviceContext';

const Analytics = () => {
  const { devices, deviceTelemetry } = useDevices();

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Analytics</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Device Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Array.from(new Set(devices.map(device => device.type))).map(type => (
                <div key={type} className="flex justify-between">
                  <span>{type}</span>
                  <span className="font-medium">
                    {devices.filter(device => device.type === type).length}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Protocol Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Array.from(new Set(devices.map(device => device.protocol))).map(protocol => (
                <div key={protocol} className="flex justify-between">
                  <span>{protocol}</span>
                  <span className="font-medium">
                    {devices.filter(device => device.protocol === protocol).length}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Telemetry Data</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {Object.keys(deviceTelemetry).length > 0
                ? `${Object.values(deviceTelemetry).flat().length} data points collected`
                : 'No telemetry data available'}
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Data Visualization</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Charts and graphs will be displayed here</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics; 