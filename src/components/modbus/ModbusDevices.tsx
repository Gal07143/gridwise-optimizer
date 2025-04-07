
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Plus, Search } from 'lucide-react';
import { ModbusDevice } from '@/types/modbus';
import ModbusDeviceCard from '@/components/modbus/ModbusDeviceCard';
import { getAllModbusDevices } from '@/services/modbus/modbusService';
import { toast } from 'sonner';

interface ModbusDevicesProps {
  onAddDevice?: () => void;
  onSelectDevice?: (device: ModbusDevice) => void;
}

const ModbusDevices: React.FC<ModbusDevicesProps> = ({ onAddDevice, onSelectDevice }) => {
  const [devices, setDevices] = useState<ModbusDevice[]>([]);
  const [filteredDevices, setFilteredDevices] = useState<ModbusDevice[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const fetchedDevices = await getAllModbusDevices();
        setDevices(fetchedDevices);
        setFilteredDevices(fetchedDevices);
      } catch (error) {
        console.error('Failed to fetch Modbus devices:', error);
        toast.error('Failed to load Modbus devices');
      } finally {
        setLoading(false);
      }
    };

    fetchDevices();
  }, []);

  useEffect(() => {
    let result = [...devices];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(device => 
        device.name.toLowerCase().includes(query) || 
        device.ip.toLowerCase().includes(query) ||
        (device.description && device.description.toLowerCase().includes(query))
      );
    }
    
    // Apply tab filter
    if (activeTab === 'active') {
      result = result.filter(device => device.is_active);
    } else if (activeTab === 'inactive') {
      result = result.filter(device => !device.is_active);
    }
    
    setFilteredDevices(result);
  }, [devices, searchQuery, activeTab]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleDeviceClick = (device: ModbusDevice) => {
    if (onSelectDevice) {
      onSelectDevice(device);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Modbus Devices</CardTitle>
        {onAddDevice && (
          <Button size="sm" onClick={onAddDevice}>
            <Plus className="h-4 w-4 mr-1" /> Add Device
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search devices..."
              className="pl-8"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>

          <Tabs defaultValue="all" value={activeTab} onValueChange={handleTabChange}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="inactive">Inactive</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-0 pt-4">
              <DeviceList 
                devices={filteredDevices} 
                loading={loading} 
                onDeviceClick={handleDeviceClick} 
              />
            </TabsContent>
            <TabsContent value="active" className="mt-0 pt-4">
              <DeviceList 
                devices={filteredDevices} 
                loading={loading} 
                onDeviceClick={handleDeviceClick} 
              />
            </TabsContent>
            <TabsContent value="inactive" className="mt-0 pt-4">
              <DeviceList 
                devices={filteredDevices} 
                loading={loading} 
                onDeviceClick={handleDeviceClick} 
              />
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
};

interface DeviceListProps {
  devices: ModbusDevice[];
  loading: boolean;
  onDeviceClick: (device: ModbusDevice) => void;
}

const DeviceList: React.FC<DeviceListProps> = ({ devices, loading, onDeviceClick }) => {
  if (loading) {
    return <div className="py-8 text-center text-muted-foreground">Loading devices...</div>;
  }

  if (devices.length === 0) {
    return <div className="py-8 text-center text-muted-foreground">No devices found</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {devices.map((device) => (
        <ModbusDeviceCard
          key={device.id}
          device={device}
          onClick={() => onDeviceClick(device)}
        />
      ))}
    </div>
  );
};

export default ModbusDevices;
