import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient('YOUR_SUPABASE_URL', 'YOUR_SUPABASE_ANON_KEY');

const DeviceManagement = () => {
  const [devices, setDevices] = useState([]);
  const [newDevice, setNewDevice] = useState({
    device_name: '',
    device_type: '',
    ip_address: '',
    port: '',
    protocol: 'Modbus',
    location: '',
  });

  const fetchDevices = async () => {
    const { data } = await supabase.from('devices').select('*');
    setDevices(data);
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  const handleAddDevice = async () => {
    await supabase.from('devices').insert([newDevice]);
    fetchDevices();
  };

  return (
    <div className="p-4">
      <h2 className="font-semibold text-lg">Device Management</h2>
      
      <div className="mb-4">
        <input
          type="text"
          placeholder="Device Name"
          value={newDevice.device_name}
          onChange={(e) => setNewDevice({ ...newDevice, device_name: e.target.value })}
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Device Type"
          value={newDevice.device_type}
          onChange={(e) => setNewDevice({ ...newDevice, device_type: e.target.value })}
          className="border p-2 rounded ml-2"
        />
        <input
          type="text"
          placeholder="IP Address"
          value={newDevice.ip_address}
          onChange={(e) => setNewDevice({ ...newDevice, ip_address: e.target.value })}
          className="border p-2 rounded ml-2"
        />
        <input
          type="number"
          placeholder="Port"
          value={newDevice.port}
          onChange={(e) => setNewDevice({ ...newDevice, port: parseInt(e.target.value) })}
          className="border p-2 rounded ml-2"
        />
        <input
          type="text"
          placeholder="Location"
          value={newDevice.location}
          onChange={(e) => setNewDevice({ ...newDevice, location: e.target.value })}
          className="border p-2 rounded ml-2"
        />
        <button
          onClick={handleAddDevice}
          className="bg-blue-500 text-white p-2 rounded ml-2"
        >
          Add Device
        </button>
      </div>

      <table className="w-full text-left border-collapse">
        <thead>
          <tr>
            <th className="border p-2">Device Name</th>
            <th className="border p-2">Type</th>
            <th className="border p-2">IP</th>
            <th className="border p-2">Port</th>
            <th className="border p-2">Protocol</th>
            <th className="border p-2">Location</th>
          </tr>
        </thead>
        <tbody>
          {devices.map((device) => (
            <tr key={device.id}>
              <td className="border p-2">{device.device_name}</td>
              <td className="border p-2">{device.device_type}</td>
              <td className="border p-2">{device.ip_address}</td>
              <td className="border p-2">{device.port}</td>
              <td className="border p-2">{device.protocol}</td>
              <td className="border p-2">{device.location}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DeviceManagement;
