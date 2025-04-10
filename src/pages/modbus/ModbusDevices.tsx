
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, Search, Filter, MoreVertical, MonitorOff, 
  Monitor, Activity, Settings, Trash2 
} from 'lucide-react';
import { 
  Card, CardHeader, CardTitle, CardDescription, CardContent 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { getAllModbusDevices, updateModbusDevice } from '@/services/modbus/modbusService';
import { ModbusDevice } from '@/types/modbus';
import { PageHeader } from '@/components/ui/page-header';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';

const ModbusDevices = () => {
  const [devices, setDevices] = useState<ModbusDevice[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const navigate = useNavigate();

  // Load devices on mount
  useEffect(() => {
    fetchDevices();
  }, []);

  // Fetch devices from API
  const fetchDevices = async () => {
    try {
      setLoading(true);
      const data = await getAllModbusDevices();
      setDevices(data);
    } catch (error) {
      console.error('Error fetching Modbus devices:', error);
      toast.error('Failed to load Modbus devices');
    } finally {
      setLoading(false);
    }
  };

  // Filter devices based on search query and active tab
  const filteredDevices = devices.filter(device => {
    const matchesSearch = 
      searchQuery === '' || 
      device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (device.description && device.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (activeTab === 'online') {
      return matchesSearch && device.status === 'online';
    } else if (activeTab === 'offline') {
      return matchesSearch && device.status === 'offline';
    } else {
      return matchesSearch;
    }
  });

  // Toggle device online/offline status
  const toggleDeviceStatus = async (device: ModbusDevice) => {
    try {
      const newStatus = device.status === 'online' ? 'offline' : 'online';
      await updateModbusDevice(device.id, { ...device, status: newStatus });
      setDevices(devices.map(d => d.id === device.id ? { ...d, status: newStatus } : d));
      toast.success(`Device ${device.name} is now ${newStatus}`);
    } catch (error) {
      toast.error(`Failed to update device status`);
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <PageHeader 
        title="Modbus Devices" 
        description="Configure and monitor your Modbus devices"
      />

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            type="search"
            placeholder="Search devices..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-1" /> Filter
          </Button>
          <Button onClick={() => navigate('/modbus/devices/add')}>
            <Plus className="h-4 w-4 mr-1" /> Add Device
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Devices</TabsTrigger>
          <TabsTrigger value="online">Online</TabsTrigger>
          <TabsTrigger value="offline">Offline</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4">
          <DevicesList 
            devices={filteredDevices} 
            loading={loading} 
            toggleStatus={toggleDeviceStatus}
            onViewDevice={(id) => navigate(`/modbus/devices/${id}`)}
          />
        </TabsContent>
        <TabsContent value="online" className="mt-4">
          <DevicesList 
            devices={filteredDevices} 
            loading={loading}
            toggleStatus={toggleDeviceStatus} 
            onViewDevice={(id) => navigate(`/modbus/devices/${id}`)}
          />
        </TabsContent>
        <TabsContent value="offline" className="mt-4">
          <DevicesList 
            devices={filteredDevices} 
            loading={loading}
            toggleStatus={toggleDeviceStatus} 
            onViewDevice={(id) => navigate(`/modbus/devices/${id}`)}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface DevicesListProps {
  devices: ModbusDevice[];
  loading: boolean;
  toggleStatus: (device: ModbusDevice) => void;
  onViewDevice: (id: string) => void;
}

const DevicesList: React.FC<DevicesListProps> = ({ 
  devices, loading, toggleStatus, onViewDevice 
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <CardHeader className="pb-2">
              <Skeleton className="h-5 w-1/2 mb-1" />
              <Skeleton className="h-4 w-3/4" />
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <div className="mt-2 flex justify-between">
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-8 w-8 rounded-full" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (devices.length === 0) {
    return (
      <Card className="p-8 text-center">
        <CardContent>
          <div className="flex flex-col items-center space-y-3">
            <Cpu className="h-12 w-12 text-muted-foreground opacity-50" />
            <h3 className="text-xl font-medium">No devices found</h3>
            <p className="text-muted-foreground">Add a Modbus device to get started</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {devices.map((device) => (
        <Card key={device.id} className="overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">{device.name}</CardTitle>
                <CardDescription>{device.ip_address || device.ip}:{device.port}</CardDescription>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onViewDevice(device.id)}>
                    <Settings className="h-4 w-4 mr-2" /> 
                    Configure
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => toggleStatus(device)}>
                    {device.status === 'online' ? (
                      <>
                        <MonitorOff className="h-4 w-4 mr-2" /> 
                        Set Offline
                      </>
                    ) : (
                      <>
                        <Monitor className="h-4 w-4 mr-2" /> 
                        Set Online
                      </>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">
                    <Trash2 className="h-4 w-4 mr-2" /> 
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Protocol:</span>
                <span className="font-medium">{device.protocol}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Unit ID:</span>
                <span className="font-medium">{device.slave_id || device.unit_id || 1}</span>
              </div>
              {device.description && (
                <p className="text-sm text-muted-foreground mt-2">{device.description}</p>
              )}
              <div className="pt-3 flex justify-between items-center">
                <Badge 
                  variant={device.status === 'online' ? "success" : "secondary"} 
                  className="flex items-center"
                >
                  <Activity className="h-3 w-3 mr-1" /> 
                  {device.status === 'online' ? 'Online' : 'Offline'}
                </Badge>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onViewDevice(device.id)}
                >
                  Monitor
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ModbusDevices;
