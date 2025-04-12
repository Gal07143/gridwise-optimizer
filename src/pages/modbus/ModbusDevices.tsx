import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDevices, Device } from '@/contexts/DeviceContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, RefreshCw, Settings, Power } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface ModbusDevice extends Device {
  ipAddress: string;
  port: number;
  slaveId: number;
}

/**
 * ModbusDeviceCard component for displaying a single Modbus device
 */
const ModbusDeviceCard = ({ device, onRefresh, onTogglePower }: { 
  device: ModbusDevice; 
  onRefresh: () => void;
  onTogglePower: () => void;
}) => (
  <Card>
    <CardHeader>
      <CardTitle>{device.name}</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">IP Address</p>
            <p className="font-medium">{device.ipAddress}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Port</p>
            <p className="font-medium">{device.port}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Slave ID</p>
            <p className="font-medium">{device.slaveId}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Status</p>
            <p className={`font-medium ${device.status === 'online' ? 'text-green-500' : 'text-red-500'}`}>
              {device.status}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Last Seen</p>
            <p className="font-medium">
              {device.last_seen ? new Date(device.last_seen).toLocaleString() : 'Never'}
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={onRefresh}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={onTogglePower}>
            <Power className="w-4 h-4 mr-2" />
            Toggle Power
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
);

/**
 * LoadingState component for displaying a loading state
 */
const LoadingState = () => (
  <div className="container mx-auto p-6">
    <Card>
      <CardContent className="p-6">
        <p className="text-center text-muted-foreground">Loading Modbus devices...</p>
      </CardContent>
    </Card>
  </div>
);

/**
 * ErrorState component for displaying an error state
 */
const ErrorState = ({ error }: { error: string }) => (
  <div className="container mx-auto p-6">
    <Card>
      <CardContent className="p-6">
        <p className="text-center text-red-500">{error}</p>
      </CardContent>
    </Card>
  </div>
);

/**
 * EmptyState component for displaying an empty state
 */
const EmptyState = () => (
  <Card>
    <CardContent className="p-6">
      <p className="text-center text-muted-foreground">No Modbus devices found</p>
    </CardContent>
  </Card>
);

/**
 * ModbusDevices component for displaying and managing Modbus devices
 */
const ModbusDevices = () => {
  const navigate = useNavigate();
  const { devices, loading, error, fetchDevices, sendCommand } = useDevices();
  const [modbusDevices, setModbusDevices] = useState<ModbusDevice[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    fetchDevices();
  }, [fetchDevices]);

  useEffect(() => {
    const filteredDevices = devices
      .filter(device => device.protocol === 'modbus')
      .map(device => ({
        ...device,
        ipAddress: device.mqtt_topic?.split('/')[0] || '',
        port: parseInt(device.mqtt_topic?.split('/')[1] || '502', 10),
        slaveId: parseInt(device.mqtt_topic?.split('/')[2] || '1', 10),
      })) as ModbusDevice[];
    setModbusDevices(filteredDevices);
  }, [devices]);

  const handleRefresh = async (deviceId: string) => {
    setIsRefreshing(true);
    try {
      await fetchDevices();
      toast.success('Device data refreshed');
    } catch (error) {
      toast.error('Failed to refresh device data');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleTogglePower = async (deviceId: string) => {
    try {
      await sendCommand(deviceId, { command: 'toggle_power' });
      toast.success('Power command sent');
    } catch (error) {
      toast.error('Failed to send power command');
    }
  };

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Modbus Devices</h1>
        <Button onClick={() => navigate('/devices/new')}>
          <Plus className="w-4 h-4 mr-2" />
          Add Modbus Device
        </Button>
      </div>

      {modbusDevices.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modbusDevices.map((device) => (
            <ModbusDeviceCard
              key={device.id}
              device={device}
              onRefresh={() => handleRefresh(device.id)}
              onTogglePower={() => handleTogglePower(device.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ModbusDevices; 