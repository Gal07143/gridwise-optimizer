import React from 'react';
import { Main } from '@/components/ui/main';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useModbusDevices } from '@/hooks/useModbusConnection';
import ModbusDeviceCard from '@/components/modbus/ModbusDeviceCard';
import { 
  ServerIcon, 
  Plus, 
  Search, 
  XCircle, 
  RefreshCw, 
  Settings 
} from 'lucide-react';
import { useState } from 'react';

const ModbusDevicesPage: React.FC = () => {
  const { devices, loading, error, refreshDevices } = useModbusDevices();
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleCreateDevice = () => {
    navigate('/modbus/devices/new');
  };

  const filteredDevices = devices.filter(device => 
    device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    device.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    device.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeviceClick = (deviceId: string) => {
    navigate(`/modbus/devices/${deviceId}`);
  };

  return (
    <Main title="Modbus Devices">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <ServerIcon className="h-5 w-5" />
          <h1 className="text-2xl font-bold">Modbus Devices</h1>
          <Badge variant="outline" className="ml-2">
            {devices.length} {devices.length === 1 ? 'Device' : 'Devices'}
          </Badge>
        </div>
        <Button onClick={handleCreateDevice}>
          <Plus className="mr-2 h-4 w-4" />
          Add Device
        </Button>
      </div>

      <div className="mb-6">
        <div className="flex gap-4 mb-4 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search devices..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                className="absolute right-2.5 top-2.5"
                onClick={() => setSearchTerm('')}
              >
                <XCircle className="h-4 w-4 text-muted-foreground" />
              </button>
            )}
          </div>
          <Button variant="outline" size="icon" onClick={refreshDevices}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-64 bg-secondary rounded-lg"></div>
          ))}
        </div>
      ) : error ? (
        <Card>
          <CardHeader>
            <CardTitle>Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-destructive">{error}</p>
            <Button className="mt-4" onClick={refreshDevices}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry
            </Button>
          </CardContent>
        </Card>
      ) : filteredDevices.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDevices.map(device => (
            <ModbusDeviceCard
              key={device.id}
              device={device}
              onClick={() => handleDeviceClick(device.id)}
            />
          ))}
        </div>
      ) : searchTerm ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <Search className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-2">No devices found matching "{searchTerm}"</p>
            <Button variant="ghost" onClick={() => setSearchTerm('')}>
              Clear Search
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <ServerIcon className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-medium mb-2">No Modbus Devices</h3>
            <p className="text-muted-foreground mb-4 text-center max-w-md">
              You haven't added any Modbus devices yet. Create your first device to start monitoring and controlling your equipment.
            </p>
            <Button onClick={handleCreateDevice}>
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Device
            </Button>
          </CardContent>
        </Card>
      )}
    </Main>
  );
};

export default ModbusDevicesPage;
