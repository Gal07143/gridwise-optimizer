import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDevices, Device, TelemetryData } from '@/contexts/DeviceContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  RefreshCw, 
  Power, 
  Settings, 
  Activity, 
  AlertTriangle, 
  ArrowLeft, 
  Clock, 
  Trash2, 
  Download,
  History
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';

// Types
interface DeviceInfoProps {
  device: Device;
  isLoading: boolean;
}

interface ConnectionDetailsProps {
  device: Device;
  isLoading: boolean;
}

interface TelemetryDisplayProps {
  telemetry: TelemetryData[];
  isLoading: boolean;
  onRefresh: () => void;
}

interface DeviceActionsProps {
  device: Device;
  onRefresh: () => void;
  onTogglePower: () => void;
  onEdit: () => void;
  onDelete: () => void;
  isRefreshing: boolean;
}

interface DeviceHeaderProps {
  device: Device;
  onBack: () => void;
}

/**
 * DeviceHeader component for displaying device name and status
 */
const DeviceHeader = ({ device, onBack }: DeviceHeaderProps) => (
  <div className="flex items-center space-x-4">
    <Button 
      variant="outline" 
      size="icon" 
      onClick={onBack} 
      className="h-8 w-8"
      aria-label="Go back to devices list"
    >
      <ArrowLeft className="h-4 w-4" />
    </Button>
    <div>
      <h1 className="text-2xl font-bold">{device.name}</h1>
      <div className="flex items-center mt-1">
        <Badge 
          variant={device.status === 'online' ? 'success' : 'destructive'} 
          className="mr-2"
          aria-label={`Device status: ${device.status}`}
        >
          {device.status}
        </Badge>
        <span className="text-xs text-muted-foreground flex items-center">
          <Clock className="h-3 w-3 mr-1" />
          {device.last_seen 
            ? `Last seen ${formatDistanceToNow(new Date(device.last_seen), { addSuffix: true })}`
            : 'Never seen'}
        </span>
      </div>
    </div>
  </div>
);

/**
 * DeviceInfo component for displaying basic device information
 */
const DeviceInfo = ({ device, isLoading }: DeviceInfoProps) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Device Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex justify-between items-center">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-32" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Device Information</CardTitle>
        <CardDescription>Basic details about the device</CardDescription>
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
            <Badge 
              variant={device.status === 'online' ? 'success' : 'destructive'}
              aria-label={`Device status: ${device.status}`}
            >
              {device.status}
            </Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Last Seen</span>
            <span className="text-sm">
              {device.last_seen 
                ? new Date(device.last_seen).toLocaleString()
                : 'Never'}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

/**
 * ConnectionDetails component for displaying connection information
 */
const ConnectionDetails = ({ device, isLoading }: ConnectionDetailsProps) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Connection Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(device.protocol === 'modbus' ? 5 : 2)].map((_, i) => (
              <div key={i} className="flex justify-between items-center">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-32" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Connection Details</CardTitle>
        <CardDescription>Connection parameters for the device</CardDescription>
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
};

/**
 * TelemetryDisplay component for displaying telemetry data
 */
const TelemetryDisplay = ({ telemetry, isLoading, onRefresh }: TelemetryDisplayProps) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Telemetry</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const handleExport = () => {
    try {
      const dataStr = JSON.stringify(telemetry, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `telemetry-${new Date().toISOString()}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      toast.success('Telemetry data exported successfully');
    } catch (error) {
      toast.error('Failed to export telemetry data');
      console.error('Export error:', error);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent Telemetry</CardTitle>
          <CardDescription>Latest data from the device</CardDescription>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onRefresh}
            aria-label="Refresh telemetry data"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleExport}
            aria-label="Export telemetry data"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {telemetry.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              No telemetry data available
            </div>
          ) : (
            telemetry.map((data, index) => (
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
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

/**
 * DeviceActions component for displaying device action buttons
 */
const DeviceActions = ({ 
  device, 
  onRefresh, 
  onTogglePower, 
  onEdit, 
  onDelete,
  isRefreshing 
}: DeviceActionsProps) => (
  <div className="flex justify-end space-x-2">
    <Button 
      variant="outline" 
      size="sm" 
      onClick={onRefresh}
      disabled={isRefreshing}
      aria-label="Refresh device data"
    >
      <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
      Refresh
    </Button>
    <Button 
      variant="outline" 
      size="sm" 
      onClick={onTogglePower}
      aria-label={`Toggle device power (currently ${device.status})`}
    >
      <Power className="h-4 w-4 mr-2" />
      Toggle Power
    </Button>
    <Button 
      variant="outline" 
      size="sm" 
      onClick={onEdit}
      aria-label="Edit device settings"
    >
      <Settings className="h-4 w-4 mr-2" />
      Edit
    </Button>
    <Button 
      variant="destructive" 
      size="sm" 
      onClick={onDelete}
      aria-label="Delete device"
    >
      <Trash2 className="h-4 w-4 mr-2" />
      Delete
    </Button>
  </div>
);

/**
 * DeviceDetails component for displaying detailed device information
 */
const DeviceDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    devices, 
    loading, 
    error, 
    fetchDevices, 
    sendCommand,
    deleteDevice 
  } = useDevices();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [telemetry, setTelemetry] = useState<TelemetryData[]>([]);

  const device = devices.find(d => d.id === id);

  useEffect(() => {
    if (!device && !loading) {
      navigate('/devices');
    }
  }, [device, loading, navigate]);

  const loadData = async () => {
    if (!device) return;
    
    setIsRefreshing(true);
    try {
      await fetchDevices();
      // Fetch telemetry data here
      setTelemetry([]); // Replace with actual telemetry data
    } catch (error) {
      toast.error('Failed to load device data');
      console.error('Load error:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    await loadData();
  };

  const handleTogglePower = async () => {
    if (!device) return;
    
    try {
      await sendCommand(device.id, { command: 'toggle_power' });
      toast.success('Power command sent successfully');
      await loadData();
    } catch (error) {
      toast.error('Failed to send power command');
      console.error('Toggle power error:', error);
    }
  };

  const handleEdit = () => {
    navigate(`/devices/${device?.id}/edit`);
  };

  const handleDelete = async () => {
    if (!device) return;
    
    try {
      await deleteDevice(device.id);
      toast.success('Device deleted successfully');
      navigate('/devices');
    } catch (error) {
      toast.error('Failed to delete device');
      console.error('Delete error:', error);
    }
  };

  if (loading || !device) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <div className="grid gap-4">
          <Skeleton className="h-[200px]" />
          <Skeleton className="h-[200px]" />
          <Skeleton className="h-[200px]" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <AlertTriangle className="w-8 h-8 text-destructive mb-4" />
        <p className="text-muted-foreground mb-4">{error}</p>
        <Button variant="outline" onClick={loadData}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DeviceHeader device={device} onBack={() => navigate('/devices')} />
      
      <DeviceActions
        device={device}
        onRefresh={handleRefresh}
        onTogglePower={handleTogglePower}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isRefreshing={isRefreshing}
      />

      <Tabs defaultValue="info" className="space-y-4">
        <TabsList>
          <TabsTrigger value="info">Information</TabsTrigger>
          <TabsTrigger value="connection">Connection</TabsTrigger>
          <TabsTrigger value="telemetry">Telemetry</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="info">
          <DeviceInfo device={device} isLoading={isRefreshing} />
        </TabsContent>

        <TabsContent value="connection">
          <ConnectionDetails device={device} isLoading={isRefreshing} />
        </TabsContent>

        <TabsContent value="telemetry">
          <TelemetryDisplay
            telemetry={telemetry}
            isLoading={isRefreshing}
            onRefresh={handleRefresh}
          />
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Device History</CardTitle>
              <CardDescription>Historical events and changes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-32 text-muted-foreground">
                <History className="h-8 w-8 mr-2" />
                History feature coming soon
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DeviceDetails; 