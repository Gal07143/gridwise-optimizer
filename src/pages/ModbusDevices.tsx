import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || '',
  import.meta.env.VITE_SUPABASE_ANON_KEY || ''
);

interface ModbusDevice {
  id: string;
  name: string;
  ip: string;
  port: number;
  unit_id: number;
  is_active: boolean;
}

export default function ModbusDevices() {
  const [devices, setDevices] = useState<ModbusDevice[]>([]);
  const [name, setName] = useState('');
  const [ip, setIp] = useState('');
  const [port, setPort] = useState(502);
  const [unitId, setUnitId] = useState(1);
  const [isActive, setIsActive] = useState(true);

  // Fetch existing devices
  const fetchDevices = async () => {
    const { data, error } = await supabase
      .from('modbus_devices')
      .select('*')
      .order('inserted_at', { ascending: false });
    if (!error && data) {
      setDevices(data as ModbusDevice[]);
    }
  };

  useEffect(() => {
    fetchDevices();
    // Optional: Subscribe to real-time changes
    const channel = supabase
      .channel('modbus_devices_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'modbus_devices',
      }, () => {
        fetchDevices(); // Re-fetch whenever there's an insert/update/delete
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Add a new device
  const handleAddDevice = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('modbus_devices').insert([{
      name: name || 'Unnamed Modbus Device',
      ip,
      port,
      unit_id: unitId,
      is_active: isActive,
    }]);
    if (!error) {
      setName('');
      setIp('');
      setPort(502);
      setUnitId(1);
      setIsActive(true);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Modbus Devices</h1>

      {/* Add Device Form */}
      <form onSubmit={handleAddDevice} className="space-y-4 mb-8 p-4 border rounded">
        <div>
          <label className="block mb-1">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Optional name"
            className="border p-2 w-full"
          />
        </div>
        <div>
          <label className="block mb-1">IP Address</label>
          <input
            type="text"
            value={ip}
            onChange={(e) => setIp(e.target.value)}
            placeholder="192.168.1.100"
            className="border p-2 w-full"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Port</label>
          <input
            type="number"
            value={port}
            onChange={(e) => setPort(Number(e.target.value))}
            className="border p-2 w-full"
          />
        </div>
        <div>
          <label className="block mb-1">Unit ID</label>
          <input
            type="number"
            value={unitId}
            onChange={(e) => setUnitId(Number(e.target.value))}
            className="border p-2 w-full"
          />
        </div>
        <div>
          <label className="block mb-1">Is Active?</label>
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
          />
        </div>
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
          Add Device
        </button>
      </form>

      {/* Device List */}
      <ul className="space-y-2">
        {devices.map((device) => (
          <li key={device.id} className="p-2 border rounded">
            <strong>{device.name}</strong> - {device.ip}:{device.port} (Unit {device.unit_id})  
            {device.is_active ? ' [Active]' : ' [Inactive]'}
          </li>
        ))}
      </ul>
    </div>
  );
}
