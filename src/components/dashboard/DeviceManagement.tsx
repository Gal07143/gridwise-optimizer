import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://xullgeycueouyxeirrqs.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh1bGxnZXljdWVvdXl4ZWlycnFzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIzMjE2NDQsImV4cCI6MjA1Nzg5NzY0NH0.n5z7ce0elijXBkrpgW_RhTAASKKe3vmzYHxwl8f2KRg');

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
    installation_date: new Date().toISOString().slice(0,10),
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
  };

  return (
    <div className="p-4">
      <h2 className="font-semibold text-lg mb-4">Device Management</h2>
      
      <div className="mb-4 grid grid-cols-3 gap-4">
        <input
          type="text"
          placeholder="Device Name"
          value={newDevice.name}
          onChange={(e) => setNewDevice({ ...newDevice, name: e.target.value })}
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Device Type"
          value={newDevice.type}
          onChange={(e) => setNewDevice({ ...newDevice, type: e.target.value })}
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Location"
          value={newDevice.location}
          onChange={(e) => setNewDevice({ ...newDevice, location: e.target.value })}
          className="border p-2 rounded"
        />
        <input
          type="number"
          placeholder="Capacity"
          value={newDevice.capacity}
          onChange={(e) => setNewDevice({ ...newDevice, capacity: parseFloat(e.target.value) })}
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Firmware"
          value={newDevice.firmware}
          onChange={(e) => setNewDevice({ ...newDevice, firmware: e.target.value })}
          className="border p-2 rounded"
        />
        <input
          type="date"
          placeholder="Installation Date"
          value={newDevice.installation_date}
          onChange={(e) => setNewDevice({ ...newDevice, installation_date: e.target.value })}
          className="border p-2 rounded"
        />
      </div>

      <button
        onClick={handleAddDevice}
        className="bg-blue-500 text-white p-2 rounded mb-4"
      >
        Add Device
      </button>

      <table className="w-full text-left border-collapse">
        <thead>
          <tr>
            <th className="border p-2">Device Name</th>
            <th className="border p-2">Type</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Location</th>
            <th className="border p-2">Capacity</th>
            <th className="border p
