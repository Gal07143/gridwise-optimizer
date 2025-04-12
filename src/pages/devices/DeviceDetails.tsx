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
    <Button variant="outline" size="icon" onClick={onBack} className="h-8 w-8">
      <ArrowLeft className="h-4 w-4" />
    </Button>
    <div>
      <h1 className="text-2xl font-bold">{device.name}</h1>
      <div className="flex items-center mt-1">
        <Badge variant={device.status === 'online' ? 'success' : 'destructive'} className="mr-2">
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
            <Badge variant={device.status === 'online' ? 'success' : 'destructive'}>
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
    const dataStr = JSON.stringify(telemetry, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `telemetry-${new Date().toISOString()}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast.success('Telemetry data exported successfully');
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent Telemetry</CardTitle>
          <CardDescription>Latest data from the device</CardDescription>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={onRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport} disabled={telemetry.length === 0}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {telemetry.length > 0 ? (
          <div className="space-y-4">
            {telemetry.map((data, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted">
                <div className="flex items-center space-x-2">
                  <Activity className="w-4 h-4 text-primary" />
                  <div>
                    <span className="text-sm font-medium block">
                      {new Date(data.timestamp).toLocaleString()}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(data.timestamp), { addSuffix: true })}
                    </span>
                  </div>
                </div>
                <div className="text-sm font-mono max-w-md overflow-hidden text-ellipsis">
                  {JSON.stringify(data.data)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <History className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-2">No telemetry data available</p>
            <p className="text-xs text-muted-foreground">
              Telemetry data will appear here when the device sends updates
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

/**
 * DeviceActions component for device control actions
 */
const DeviceActions = ({ 
  device, 
  onRefresh, 
  onTogglePower, 
  onEdit, 
  onDelete,
  isRefreshing 
}: DeviceActionsProps) => (
  <div className="flex flex-wrap gap-2">
    <Button 
      variant="outline" 
      onClick={onRefresh}
      disabled={isRefreshing}
    >
      <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
      {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
    </Button>
    <Button 
      variant="outline" 
      onClick={onTogglePower}
      className={device.status === 'online' ? 'text-green-500 hover:text-green-600' : 'text-red-500 hover:text-red-600'}
    >
      <Power className="h-4 w-4 mr-2" />
      {device.status === 'online' ? 'Turn Off' : 'Turn On'}
    </Button>
    <Button variant="outline" onClick={onEdit}>
      <Settings className="h-4 w-4 mr-2" />
      Edit Device
    </Button>
    <Button variant="outline" onClick={onDelete} className="text-destructive hover:text-destructive">
      <Trash2 className="h-4 w-4 mr-2" />
      Delete
    </Button>
  </div>
);

/**
 * DeviceDetails component for displaying and managing a single device
 */
const DeviceDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { devices, deviceTelemetry, fetchDevices, sendCommand, deleteDevice, fetchDeviceTelemetry } = useDevices();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('info');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const device = devices.find(d => d.id === id);
  const telemetry = device ? deviceTelemetry[device.id] || [] : [];

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        if (!device) {
          await fetchDevices();
        }
        if (device) {
          await fetchDeviceTelemetry(device.id);
        }
      } catch (error) {
        toast.error('Failed to load device data');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [device, fetchDevices, fetchDeviceTelemetry]);

  const handleRefresh = async () => {
    if (!device) return;
    setIsRefreshing(true);
    try {
      await fetchDevices();
      await fetchDeviceTelemetry(device.id);
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

  const handleDelete = async () => {
    if (!device) return;
    try {
      await deleteDevice(device.id);
      toast.success('Device deleted successfully');
      navigate('/devices');
    } catch (error) {
      toast.error('Failed to delete device');
    }
  };

  if (!device && !isLoading) {
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
        {device && <DeviceHeader device={device} onBack={() => navigate('/devices')} />}
        {device && (
          <DeviceActions
            device={device}
            onRefresh={handleRefresh}
            onTogglePower={handleTogglePower}
            onEdit={handleEdit}
            onDelete={() => setShowDeleteConfirm(true)}
            isRefreshing={isRefreshing}
          />
        )}
      </div>

      {device && (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="info">Information</TabsTrigger>
            <TabsTrigger value="connection">Connection</TabsTrigger>
            <TabsTrigger value="telemetry">Telemetry</TabsTrigger>
          </TabsList>
          <TabsContent value="info" className="space-y-4">
            <DeviceInfo device={device} isLoading={isLoading} />
          </TabsContent>
          <TabsContent value="connection" className="space-y-4">
            <ConnectionDetails device={device} isLoading={isLoading} />
          </TabsContent>
          <TabsContent value="telemetry" className="space-y-4">
            <TelemetryDisplay 
              telemetry={telemetry} 
              isLoading={isLoading} 
              onRefresh={handleRefresh} 
            />
          </TabsContent>
        </Tabs>
      )}

      {showDeleteConfirm && device && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Delete Device</CardTitle>
              <CardDescription>
                Are you sure you want to delete {device.name}? This action cannot be undone.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                Delete
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default DeviceDetails; 