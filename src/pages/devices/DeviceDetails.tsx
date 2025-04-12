import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDevices, Device, TelemetryData } from '@/contexts/DeviceContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RefreshCw, Power, Settings, Activity, AlertTriangle, ArrowLeft } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface DeviceInfoProps {
  device: Device;
}

/**
 * DeviceInfo component for displaying basic device information
 */
const DeviceInfo = ({ device }: DeviceInfoProps) => (
  <Card>
    <CardHeader>
      <CardTitle>Device Information</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Name</span>
          <span className="text-sm">{device.name}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Type</span>
          <span className="text-sm">{device.type}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Protocol</span>
          <span className="text-sm">{device.protocol}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Status</span>
          <span className={`text-sm font-medium ${
            device.status === 'online' ? 'text-green-500' : 'text-red-500'
          }`}>
            {device.status}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Last Seen</span>
          <span className="text-sm">
            {device.last_seen ? new Date(device.last_seen).toLocaleString() : 'Never'}
          </span>
        </div>
      </div>
    </CardContent>
  </Card>
);

interface ConnectionDetailsProps {
  device: Device;
}

/**
 * ConnectionDetails component for displaying connection information
 */
const ConnectionDetails = ({ device }: ConnectionDetailsProps) => (
  <Card>
    <CardHeader>
      <CardTitle>Connection Details</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">MQTT Topic</span>
          <span className="text-sm font-mono">{device.mqtt_topic}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">HTTP Endpoint</span>
          <span className="text-sm font-mono">{device.http_endpoint || 'N/A'}</span>
        </div>
        {device.protocol === 'modbus' && (
          <>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">IP Address</span>
              <span className="text-sm font-mono">{device.ip_address}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Port</span>
              <span className="text-sm font-mono">{device.port}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Slave ID</span>
              <span className="text-sm font-mono">{device.slave_id}</span>
            </div>
          </>
        )}
      </div>
    </CardContent>
  </Card>
);

interface TelemetryDisplayProps {
  telemetry: TelemetryData[];
}

/**
 * TelemetryDisplay component for displaying telemetry data
 */
const TelemetryDisplay = ({ telemetry }: TelemetryDisplayProps) => (
  <Card>
    <CardHeader>
      <CardTitle>Recent Telemetry</CardTitle>
    </CardHeader>
    <CardContent>
      {telemetry.length > 0 ? (
        <div className="space-y-4">
          {telemetry.map((data, index) => (
            <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-muted">
              <div className="flex items-center space-x-2">
                <Activity className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">{data.timestamp}</span>
              </div>
              <span className="text-sm font-mono">{JSON.stringify(data.data)}</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground">No telemetry data available</p>
      )}
    </CardContent>
  </Card>
);

interface DeviceActionsProps {
  device: Device;
  onRefresh: () => void;
  onTogglePower: () => void;
  onEdit: () => void;
}

/**
 * DeviceActions component for device control actions
 */
const DeviceActions = ({ device, onRefresh, onTogglePower, onEdit }: DeviceActionsProps) => (
  <div className="flex flex-wrap gap-2">
    <Button variant="outline" onClick={onRefresh}>
      <RefreshCw className="w-4 h-4 mr-2" />
      Refresh Data
    </Button>
    <Button variant="outline" onClick={onTogglePower}>
      <Power className="w-4 h-4 mr-2" />
      Toggle Power
    </Button>
    <Button variant="outline" onClick={onEdit}>
      <Settings className="w-4 h-4 mr-2" />
      Edit Device
    </Button>
  </div>
);

/**
 * DeviceDetails component for displaying and managing a single device
 */
const DeviceDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { devices, deviceTelemetry, fetchDevices, sendCommand } = useDevices();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('info');

  const device = devices.find(d => d.id === id);
  const telemetry = device ? deviceTelemetry[device.id] || [] : [];

  useEffect(() => {
    if (!device) {
      fetchDevices();
    }
  }, [device, fetchDevices]);

  const handleRefresh = async () => {
    if (!device) return;
    setIsRefreshing(true);
    try {
      await fetchDevices();
      toast.success('Device data refreshed successfully');
    } catch (error) {
      toast.error('Failed to refresh device data');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleTogglePower = async () => {
    if (!device) return;
    try {
      await sendCommand(device.id, { command: 'toggle_power' });
      toast.success('Power command sent successfully');
    } catch (error) {
      toast.error('Failed to send power command');
    }
  };

  const handleEdit = () => {
    if (!device) return;
    navigate(`/devices/${device.id}/edit`);
  };

  if (!device) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex flex-col items-center justify-center p-8">
          <AlertTriangle className="w-8 h-8 text-destructive mb-4" />
          <p className="text-muted-foreground mb-4">Device not found</p>
          <Button variant="outline" onClick={() => navigate('/devices')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Devices
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={() => navigate('/devices')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">{device.name}</h1>
        </div>
        <DeviceActions
          device={device}
          onRefresh={handleRefresh}
          onTogglePower={handleTogglePower}
          onEdit={handleEdit}
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="info">Information</TabsTrigger>
          <TabsTrigger value="connection">Connection</TabsTrigger>
          <TabsTrigger value="telemetry">Telemetry</TabsTrigger>
        </TabsList>
        <TabsContent value="info" className="space-y-4">
          <DeviceInfo device={device} />
        </TabsContent>
        <TabsContent value="connection" className="space-y-4">
          <ConnectionDetails device={device} />
        </TabsContent>
        <TabsContent value="telemetry" className="space-y-4">
          <TelemetryDisplay telemetry={telemetry} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DeviceDetails; 