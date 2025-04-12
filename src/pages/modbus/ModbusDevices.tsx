
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Main } from '@/components/ui/main';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, X, Wifi, Settings, WifiOff } from 'lucide-react';
import { toast } from 'sonner';
import { ModbusDevice } from '@/types/modbus';

// Mock data and service functions
const mockModbusDevices: ModbusDevice[] = [
  {
    id: 'modbus-1',
    name: 'Solar Inverter',
    ip_address: '192.168.1.100',
    port: 502,
    unit_id: 1,
    protocol: 'tcp',
    status: 'online'
  },
  {
    id: 'modbus-2',
    name: 'Battery Management System',
    ip_address: '192.168.1.101',
    port: 502,
    unit_id: 2,
    protocol: 'tcp',
    status: 'offline'
  },
  {
    id: 'modbus-3',
    name: 'Energy Meter',
    ip_address: '192.168.1.102',
    port: 1502,
    unit_id: 3,
    protocol: 'rtu',
    status: 'online'
  },
  {
    id: 'modbus-4',
    name: 'HVAC Controller',
    ip_address: '192.168.1.103',
    port: 502,
    unit_id: 4,
    protocol: 'tcp',
    status: 'error'
  }
];

// Mock service function
const getModbusDevices = async (): Promise<ModbusDevice[]> => {
  // In a real app, this would fetch from an API
  return mockModbusDevices;
};

const deleteModbusDevice = async (deviceId: string): Promise<boolean> => {
  console.log(`Deleting Modbus device: ${deviceId}`);
  return true;
};

const ModbusDevices = () => {
  const navigate = useNavigate();
  const [devices, setDevices] = useState<ModbusDevice[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    const fetchDevices = async () => {
      try {
        setLoading(true);
        const data = await getModbusDevices();
        setDevices(data);
      } catch (error) {
        console.error('Failed to fetch devices:', error);
        toast.error('Failed to load devices');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDevices();
  }, []);
  
  const handleAddDevice = () => {
    navigate('/modbus/add-device');
  };
  
  const handleDeleteDevice = async (deviceId: string) => {
    try {
      const success = await deleteModbusDevice(deviceId);
      if (success) {
        setDevices(devices.filter(d => d.id !== deviceId));
        toast.success('Device deleted successfully');
      }
    } catch (error) {
      console.error('Failed to delete device:', error);
      toast.error('Failed to delete device');
    }
  };
  
  const filteredDevices = devices.filter(device => 
    device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    device.ip_address?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const statusIcons = {
    online: <Wifi className="h-4 w-4 text-green-500" />,
    offline: <WifiOff className="h-4 w-4 text-slate-500" />,
    error: <Settings className="h-4 w-4 text-red-500" />
  };
  
  return (
    <Main title="Modbus Devices">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Modbus Devices</h1>
          <p className="text-muted-foreground mt-1">Configure and monitor Modbus-compatible devices</p>
        </div>
        <Button onClick={handleAddDevice}>
          <Plus className="h-4 w-4 mr-2" />
          Add Device
        </Button>
      </div>
      
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search devices..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-9"
          />
          {searchQuery && (
            <button
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              onClick={() => setSearchQuery('')}
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
      
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="h-24 bg-muted"></CardHeader>
              <CardContent className="h-32"></CardContent>
            </Card>
          ))}
        </div>
      ) : filteredDevices.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2">No devices found</h2>
          <p className="text-muted-foreground mb-6">Add a new Modbus device to get started</p>
          <Button onClick={handleAddDevice}>
            <Plus className="h-4 w-4 mr-2" />
            Add Device
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDevices.map(device => (
            <Card key={device.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center">
                      {statusIcons[device.status as keyof typeof statusIcons]}
                      <span className="ml-2">{device.name}</span>
                    </CardTitle>
                    <CardDescription>{device.ip_address}:{device.port}</CardDescription>
                  </div>
                  <Badge>{device.protocol.toUpperCase()}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="grid grid-cols-2 text-sm">
                    <span className="text-muted-foreground">Unit ID</span>
                    <span>{device.unit_id || device.slave_id}</span>
                  </div>
                  <div className="grid grid-cols-2 text-sm">
                    <span className="text-muted-foreground">Status</span>
                    <span className={device.status === 'online' ? 'text-green-500' : device.status === 'error' ? 'text-red-500' : 'text-slate-500'}>
                      {device.status?.charAt(0).toUpperCase() + device.status?.slice(1)}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 text-sm">
                    <span className="text-muted-foreground">Last Seen</span>
                    <span>{device.last_online ? new Date(device.last_online).toLocaleString() : 'Never'}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" size="sm" onClick={() => navigate(`/modbus/devices/${device.id}`)}>
                  View Details
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleDeleteDevice(device.id)}>
                  Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </Main>
  );
};

export default ModbusDevices;
