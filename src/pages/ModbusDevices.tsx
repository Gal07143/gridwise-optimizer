
import React, { useEffect, useState } from 'react';
import { Main } from '@/components/ui/main';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';

interface ModbusDevice {
  id: string;
  name: string;
  device_id: string;
  ip_address: string;
  port: number;
  slave_id: number;
  status: string;
  last_poll_time: string;
}

const ModbusDevices = () => {
  const [devices, setDevices] = useState<ModbusDevice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDevices = async () => {
      setLoading(true);
      
      try {
        const { data, error } = await supabase
          .from('modbus_devices')
          .select('*')
          .order('name');
          
        if (error) {
          throw error;
        }
        
        setDevices(data as ModbusDevice[]);
      } catch (error) {
        console.error('Error fetching Modbus devices:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDevices();
  }, []);

  return (
    <Main title="Modbus Devices">
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Modbus Devices</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-4">Loading devices...</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Device ID</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead>Port</TableHead>
                    <TableHead>Slave ID</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Poll</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {devices.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center">
                        No devices found
                      </TableCell>
                    </TableRow>
                  ) : (
                    devices.map((device) => (
                      <TableRow key={device.id}>
                        <TableCell className="font-medium">{device.name}</TableCell>
                        <TableCell>{device.device_id}</TableCell>
                        <TableCell>{device.ip_address}</TableCell>
                        <TableCell>{device.port}</TableCell>
                        <TableCell>{device.slave_id}</TableCell>
                        <TableCell>
                          <span className={`inline-block px-2 py-1 rounded-full ${
                            device.status === 'online' ? 'bg-green-100 text-green-800' : 
                            device.status === 'error' ? 'bg-red-100 text-red-800' : 
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {device.status}
                          </span>
                        </TableCell>
                        <TableCell>{new Date(device.last_poll_time).toLocaleString()}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </Main>
  );
};

export default ModbusDevices;
