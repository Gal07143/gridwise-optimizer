
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ModbusDevice } from '@/types/modbus';
import { getAllModbusDevices, scanForDevices } from '@/services/modbus/modbusService';
import { toast } from 'sonner';
import { Plus, Search, Cpu, RefreshCw, Server, Settings, Activity } from 'lucide-react';

const ModbusDevices = () => {
  const navigate = useNavigate();
  const [devices, setDevices] = useState<ModbusDevice[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    loadDevices();
  }, []);

  const loadDevices = async () => {
    try {
      setLoading(true);
      const data = await getAllModbusDevices();
      setDevices(data);
    } catch (error) {
      toast.error('Failed to load devices');
      console.error('Error fetching devices:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleScanForDevices = async () => {
    setIsScanning(true);
    try {
      const discoveredDevices = await scanForDevices('192.168.1.1', '192.168.1.255');
      if (discoveredDevices.length > 0) {
        toast.success(`Discovered ${discoveredDevices.length} devices on the network`);
        setDevices(prevDevices => [...prevDevices, ...discoveredDevices]);
      } else {
        toast.info('No new devices discovered on the network');
      }
    } catch (error) {
      toast.error('Failed to scan for devices');
      console.error('Error scanning for devices:', error);
    } finally {
      setIsScanning(false);
    }
  };

  const handleDeviceSelect = (deviceId: string) => {
    navigate(`/modbus/devices/${deviceId}`);
  };

  const filteredDevices = searchTerm
    ? devices.filter(device => device.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : devices;

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-400';
      case 'offline':
        return 'bg-gray-400';
      case 'error':
        return 'bg-red-400';
      default:
        return 'bg-gray-400';
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Modbus Devices</h1>
          <p className="text-muted-foreground">
            Manage and monitor your Modbus TCP and RTU devices
          </p>
        </div>
        <Button onClick={() => navigate('/modbus/add')}>
          <Plus className="mr-2 h-4 w-4" /> Add Device
        </Button>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search devices..."
            value={searchTerm}
            onChange={handleSearch}
            className="pl-8"
          />
        </div>
        <Button 
          variant="outline" 
          onClick={handleScanForDevices}
          disabled={isScanning}
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${isScanning ? 'animate-spin' : ''}`} />
          {isScanning ? 'Scanning...' : 'Scan Network'}
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <RefreshCw className="animate-spin h-8 w-8 text-muted-foreground" />
        </div>
      ) : filteredDevices.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDevices.map((device) => (
            <Card key={device.id} className="cursor-pointer hover:shadow-md transition-shadow duration-200" onClick={() => handleDeviceSelect(device.id)}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center">
                      <Server className="h-5 w-5 mr-2 text-primary" /> {device.name}
                    </CardTitle>
                    <CardDescription>
                      {device.ip_address || device.ip}:{device.port}
                    </CardDescription>
                  </div>
                  <Badge variant={device.status === 'online' ? 'success' : 'secondary'}>
                    <div className={`w-2 h-2 rounded-full mr-1.5 ${getStatusColor(device.status)}`}></div>
                    {device.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-muted-foreground">Protocol</div>
                  <div className="text-right font-medium">{device.protocol.toUpperCase()}</div>
                  
                  <div className="text-muted-foreground">Unit ID</div>
                  <div className="text-right font-medium">{device.unit_id || device.slave_id || 1}</div>
                </div>
                {device.description && (
                  <p className="mt-2 text-sm italic text-muted-foreground">{device.description}</p>
                )}
              </CardContent>
              <CardFooter className="pt-2">
                <div className="w-full flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">
                    {device.last_updated ? `Updated: ${new Date(device.last_updated).toLocaleString()}` : ''}
                  </span>
                  <Button variant="ghost" size="sm">
                    <Activity className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-8">
            <div className="text-center">
              <Server className="h-12 w-12 mx-auto text-muted-foreground opacity-50 mb-4" />
              <h3 className="text-lg font-medium mb-2">No Modbus devices found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm ? 'No devices match your search' : 'Get started by adding a Modbus device or scanning your network'}
              </p>
              <div className="flex justify-center space-x-2">
                <Button onClick={() => navigate('/modbus/add')}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Device
                </Button>
                <Button variant="outline" onClick={handleScanForDevices} disabled={isScanning}>
                  <RefreshCw className={`mr-2 h-4 w-4 ${isScanning ? 'animate-spin' : ''}`} />
                  Scan Network
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ModbusDevices;
