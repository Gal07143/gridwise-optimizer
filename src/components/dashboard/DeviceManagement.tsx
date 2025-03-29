import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const DeviceManagement = () => {
  const [devices, setDevices] = useState([]);
  const [newDevice, setNewDevice] = useState({
    name: '',
    type: '',
    status: 'offline',
    location: '',
    capacity: 0,
    firmware: '',
    lat: 0,
    lng: 0,
    installation_date: new Date().toISOString().slice(0, 10),
  });

  const fetchDevices = async () => {
    const { data } = await supabase.from('devices').select('*');
    setDevices(data || []);
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  const handleAddDevice = async () => {
    await supabase.from('devices').insert([newDevice]);
    fetchDevices();
    setNewDevice({
      name: '',
      type: '',
      status: 'offline',
      location: '',
      capacity: 0,
      firmware: '',
      lat: 0,
      lng: 0,
      installation_date: new Date().toISOString().slice(0, 10),
    });
  };

  return (
    <Card className="p-4">
      <CardHeader>
        <CardTitle className="text-lg">Device Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            type="text"
            placeholder="Device Name"
            value={newDevice.name}
            onChange={(e) => setNewDevice({ ...newDevice, name: e.target.value })}
          />
          <Input
            type="text"
            placeholder="Device Type"
            value={newDevice.type}
            onChange={(e) => setNewDevice({ ...newDevice, type: e.target.value })}
          />
          <Input
            type="text"
            placeholder="Location"
            value={newDevice.location}
            onChange={(e) => setNewDevice({ ...newDevice, location: e.target.value })}
          />
          <Input
            type="number"
            placeholder="Capacity"
            value={newDevice.capacity}
            onChange={(e) => setNewDevice({ ...newDevice, capacity: parseFloat(e.target.value) })}
          />
          <Input
            type="text"
            placeholder="Firmware"
            value={newDevice.firmware}
            onChange={(e) => setNewDevice({ ...newDevice, firmware: e.target.value })}
          />
          <Input
            type="date"
            placeholder="Installation Date"
            value={newDevice.installation_date}
            onChange={(e) => setNewDevice({ ...newDevice, installation_date: e.target.value })}
          />
        </div>

        <Button onClick={handleAddDevice} className="mb-4">
          Add Device
        </Button>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Device Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Capacity</TableHead>
              <TableHead>Firmware</TableHead>
              <TableHead>Installation Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {devices.map((device) => (
              <TableRow key={device.id}>
                <TableCell>{device.name}</TableCell>
                <TableCell>{device.type}</TableCell>
                <TableCell>{device.status}</TableCell>
                <TableCell>{device.location}</TableCell>
                <TableCell>{device.capacity}</TableCell>
                <TableCell>{device.firmware}</TableCell>
                <TableCell>{device.installation_date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default DeviceManagement;
