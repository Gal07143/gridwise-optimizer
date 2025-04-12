import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDevices, Device } from '@/contexts/DeviceContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const DeviceDetailsPage = () => {
  const { deviceId } = useParams<{ deviceId: string }>();
  const navigate = useNavigate();
  const { devices, deviceTelemetry, fetchDeviceTelemetry } = useDevices();

  const device = devices.find(d => d.id === deviceId);

  useEffect(() => {
    if (deviceId) {
      fetchDeviceTelemetry(deviceId);
    }
  }, [deviceId, fetchDeviceTelemetry]);

  if (!device) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center mb-6">
          <Button variant="outline" onClick={() => navigate('/devices')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Devices
          </Button>
        </div>
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-muted-foreground">Device not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const telemetryData = deviceTelemetry[device.id] || [];

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center mb-6">
        <Button variant="outline" onClick={() => navigate('/devices')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Devices
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Device Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">Name:</span>
                <span>{device.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Type:</span>
                <span>{device.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Protocol:</span>
                <span>{device.protocol}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Status:</span>
                <span className={device.status === 'online' ? 'text-green-500' : 'text-red-500'}>
                  {device.status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Last Seen:</span>
                <span>{device.last_seen ? new Date(device.last_seen).toLocaleString() : 'Never'}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Connection Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {device.mqtt_topic && (
                <div className="flex justify-between">
                  <span className="font-medium">MQTT Topic:</span>
                  <span>{device.mqtt_topic}</span>
                </div>
              )}
              {device.http_endpoint && (
                <div className="flex justify-between">
                  <span className="font-medium">HTTP Endpoint:</span>
                  <span>{device.http_endpoint}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Recent Telemetry Data</CardTitle>
        </CardHeader>
        <CardContent>
          {telemetryData.length > 0 ? (
            <div className="space-y-4">
              {telemetryData.slice(0, 5).map((data, index) => (
                <div key={data.id} className="border-b pb-2 last:border-b-0">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{new Date(data.timestamp).toLocaleString()}</span>
                    <span>{data.source}</span>
                  </div>
                  <pre className="mt-1 text-sm bg-muted p-2 rounded">
                    {JSON.stringify(data.message, null, 2)}
                  </pre>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No telemetry data available</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DeviceDetailsPage; 