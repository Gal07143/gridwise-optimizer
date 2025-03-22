// /src/components/dashboard/ModbusCard.tsx
import React from 'react';
import MetricsCard from '@/components/dashboard/MetricsCard';
import { useModbusReadings } from '@/hooks/useModbusReadings';

const ModbusCard = () => {
  const { readings, loading } = useModbusReadings(1); // fetch the latest reading

  if (loading) {
    return (
      <MetricsCard 
        title="Latest Modbus Reading" 
        value="Loading..."
        className="shadow-md"
      />
    );
  }
  
  if (!readings || readings.length === 0) {
    return (
      <MetricsCard 
        title="Latest Modbus Reading" 
        value="No data" 
        className="shadow-md"
      />
    );
  }
  
  const latest = readings[0];

  return (
    <MetricsCard
      title="Latest Modbus Reading"
      value={latest.power_kw}
      unit="kW"
      subtitle={`Voltage: ${latest.voltage} V | Current: ${latest.current} A`}
      description={`Energy: ${latest.energy_kwh} kWh`}
      className="shadow-md"
    />
  );
};

export default ModbusCard;
