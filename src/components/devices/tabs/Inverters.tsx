
import React from 'react';
import { useDevices } from '@/hooks/useDevices';

const Inverters = () => {
  const { devices, loading, error } = useDevices('inverter');

  if (loading) return <p>Loading Inverters...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Inverters</h1>
      {devices.length === 0 ? (
        <p>No inverter devices found.</p>
      ) : (
        <ul className="space-y-2">
          {devices.map((device) => (
            <li key={device.id} className="p-2 border rounded shadow">
              <h2 className="font-semibold">{device.name}</h2>
              <p>Status: {device.status}</p>
              <p>Last Updated: {new Date(device.last_updated || '').toLocaleString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Inverters;
