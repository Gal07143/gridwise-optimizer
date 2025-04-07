
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
  const { devices, isLoading, error, refetch } = useModbusDevices();
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleCreateDevice = () => {
    navigate('/modbus/devices/new');
  };

  const filteredDevices = devices.filter(device => 
    device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (device.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
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
        </div>
        <Button onClick={handleCreateDevice}>
          <Plus className="h-4 w-4 mr-2" />
          Add Device
        </Button>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Search devices..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button 
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              onClick={() => setSearchTerm('')}
            >
              <XCircle size={18} />
            </button>
          )}
        </div>
        
        <Button variant="outline" onClick={refetch}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
        
        <Button variant="outline">
          <Settings className="h-4 w-4 mr-2" />
          Options
        </Button>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <Card>
          <CardContent className="py-8">
            <div className="text-center">
              <div className="text-red-500 font-semibold mb-2">Error Loading Devices</div>
              <p className="text-muted-foreground mb-4">
                {error instanceof Error ? error.message : String(error)}
              </p>
              <Button variant="outline" onClick={refetch}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : filteredDevices.length === 0 ? (
        <Card>
          <CardContent className="py-8">
            <div className="text-center">
              <p className="text-muted-foreground mb-4">
                {searchTerm ? "No devices matching your search" : "No devices have been added yet"}
              </p>
              <Button onClick={handleCreateDevice}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Device
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDevices.map((device) => (
            <ModbusDeviceCard 
              key={device.id} 
              device={device} 
              onClick={() => handleDeviceClick(device.id)} 
            />
          ))}
        </div>
      )}
    </Main>
  );
};

export default ModbusDevicesPage;
