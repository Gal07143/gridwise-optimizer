
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Main } from '@/components/ui/main';
import { EnergyDevice } from '@/types/energy';

const mockDevice: EnergyDevice = {
  id: "mock-device-1",
  name: "Solar Inverter",
  type: "solar",
  status: "online",
  capacity: 10,
  current_output: 8.5,
  created_at: new Date().toISOString(),
  last_updated: new Date().toISOString(),
  site_id: "site-1",
  description: "Main solar inverter"
};

const DeviceView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [device, setDevice] = useState<EnergyDevice | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Simulate fetching device
    setTimeout(() => {
      setDevice({
        ...mockDevice,
        id: id || mockDevice.id
      });
      setLoading(false);
    }, 500);
  }, [id]);
  
  if (loading) {
    return <Main>Loading device...</Main>;
  }
  
  if (!device) {
    return <Main>Device not found</Main>;
  }
  
  return (
    <Main title={device.name}>
      <h1>{device.name}</h1>
      <p>Type: {device.type}</p>
      <p>Status: {device.status}</p>
      <p>Capacity: {device.capacity} kW</p>
    </Main>
  );
};

export default DeviceView;
