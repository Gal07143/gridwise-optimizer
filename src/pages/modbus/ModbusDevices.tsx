import React, { useEffect, useState } from 'react';
import { useDevices } from '@/contexts/DeviceContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface ModbusDevice {
  id: string;
  name: string;
  ipAddress: string;
  port: number;
  slaveId: number;
  status: 'connected' | 'disconnected';
  lastSeen?: string;
}

const ModbusDevices = () => {
  const { devices } = useDevices();
  const [modbusDevices, setModbusDevices] = useState<ModbusDevice[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter Modbus devices from all devices
  useEffect(() => {
    const modbusDevs = devices
      .filter(device => device.protocol === 'modbus')
      .map(device => ({
        id: device.id,
        name: device.name,
        ipAddress: device.metadata?.ipAddress || 'Unknown',
        port: device.metadata?.port || 502,
        slaveId: device.metadata?.slaveId || 1,
        status: device.status === 'online' ? 'connected' as const : 'disconnected' as const,
        lastSeen: device.last_seen,
      }));
    
    setModbusDevices(modbusDevs);
    setLoading(false);
  }, [devices]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Modbus Devices</h1>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Modbus Device
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {modbusDevices.length > 0 ? (
          modbusDevices.map(device => (
            <Card key={device.id}>
              <CardHeader>
                <CardTitle>{device.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">IP Address:</span>
                    <span>{device.ipAddress}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Port:</span>
                    <span>{device.port}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Slave ID:</span>
                    <span>{device.slaveId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Status:</span>
                    <span className={device.status === 'connected' ? 'text-green-500' : 'text-red-500'}>
                      {device.status}
                    </span>
                  </div>
                  {device.lastSeen && (
                    <div className="flex justify-between">
                      <span className="font-medium">Last Seen:</span>
                      <span>{new Date(device.lastSeen).toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="col-span-full">
            <CardContent className="p-6">
              <p className="text-center text-muted-foreground">No Modbus devices found</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ModbusDevices; 