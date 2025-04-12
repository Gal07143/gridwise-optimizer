import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDevices, Device } from '@/contexts/DeviceContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RefreshCw, Search, Plus, Power, AlertTriangle } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface DeviceCardProps {
  device: Device;
  onRefresh: () => void;
  onTogglePower: () => void;
}

/**
 * DeviceCard component for displaying individual device information
 */
const DeviceCard = ({ device, onRefresh, onTogglePower }: DeviceCardProps) => (
  <Card className="hover:shadow-lg transition-shadow">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-lg font-medium">{device.name}</CardTitle>
      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
        device.status === 'online' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
      }`}>
        {device.status}
      </div>
    </CardHeader>
    <CardContent>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Type:</span>
          <span className="font-medium">{device.type}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Protocol:</span>
          <span className="font-medium">{device.protocol}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Last Seen:</span>
          <span className="font-medium">
            {device.last_seen ? new Date(device.last_seen).toLocaleString() : 'Never'}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">MQTT Topic:</span>
          <span className="font-medium truncate max-w-[200px]">{device.mqtt_topic}</span>
        </div>
      </div>
      <div className="flex justify-end space-x-2 mt-4">
        <Button variant="outline" size="sm" onClick={onRefresh}>
          <RefreshCw className="w-4 h-4 mr-1" />
          Refresh
        </Button>
        <Button variant="outline" size="sm" onClick={onTogglePower}>
          <Power className="w-4 h-4 mr-1" />
          Toggle Power
        </Button>
      </div>
    </CardContent>
  </Card>
);

/**
 * LoadingState component for displaying loading state
 */
const LoadingState = () => (
  <div className="flex flex-col items-center justify-center p-8">
    <RefreshCw className="w-8 h-8 animate-spin text-muted-foreground mb-4" />
    <p className="text-muted-foreground">Loading devices...</p>
  </div>
);

/**
 * ErrorState component for displaying error state
 */
const ErrorState = ({ message, onRetry }: { message: string; onRetry: () => void }) => (
  <div className="flex flex-col items-center justify-center p-8">
    <AlertTriangle className="w-8 h-8 text-destructive mb-4" />
    <p className="text-muted-foreground mb-4">{message}</p>
    <Button variant="outline" onClick={onRetry}>
      <RefreshCw className="w-4 h-4 mr-2" />
      Try Again
    </Button>
  </div>
);

/**
 * EmptyState component for displaying empty state
 */
const EmptyState = ({ onAddDevice }: { onAddDevice: () => void }) => (
  <div className="flex flex-col items-center justify-center p-8">
    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
      <Plus className="w-8 h-8 text-muted-foreground" />
    </div>
    <p className="text-muted-foreground mb-4">No devices found</p>
    <Button onClick={onAddDevice}>
      <Plus className="w-4 h-4 mr-2" />
      Add Device
    </Button>
  </div>
);

/**
 * Devices component for managing and displaying devices
 */
const Devices = () => {
  const navigate = useNavigate();
  const { devices, loading, error, fetchDevices, sendCommand } = useDevices();
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    fetchDevices();
  }, [fetchDevices]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await fetchDevices();
      toast.success('Devices refreshed successfully');
    } catch (error) {
      toast.error('Failed to refresh devices');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleTogglePower = async (deviceId: string) => {
    try {
      await sendCommand(deviceId, { command: 'toggle_power' });
      toast.success('Power command sent successfully');
    } catch (error) {
      toast.error('Failed to send power command');
    }
  };

  const filteredDevices = devices.filter(device =>
    device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    device.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    device.protocol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchDevices} />;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
        <h1 className="text-2xl font-bold">Devices</h1>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search devices..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 w-full sm:w-[300px]"
            />
          </div>
          <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={() => navigate('/devices/new')}>
            <Plus className="w-4 h-4 mr-2" />
            Add Device
          </Button>
        </div>
      </div>

      {filteredDevices.length === 0 ? (
        <EmptyState onAddDevice={() => navigate('/devices/new')} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDevices.map((device) => (
            <DeviceCard
              key={device.id}
              device={device}
              onRefresh={handleRefresh}
              onTogglePower={() => handleTogglePower(device.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Devices;