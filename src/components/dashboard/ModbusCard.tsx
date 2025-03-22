import React from 'react';
import { useModbusReadings } from '@/hooks/useModbusReadings';

const ModbusCard = () => {
  const { readings, loading } = useModbusReadings(1); // get the latest reading

  if (loading) return <p>Loading Modbus data...</p>;
  if (!readings || readings.length === 0) return <p>No Modbus data found.</p>;

  const latest = readings[0];

  return (
    <div className="p-4 border rounded-lg shadow bg-white dark:bg-slate-800">
      <h2 className="text-lg font-semibold mb-2">Latest Modbus Reading</h2>
      <p>Device: {latest.device_id}</p>
      <p>Voltage: {latest.voltage} V</p>
      <p>Current: {latest.current} A</p>
      <p>Power: {latest.power_kw} kW</p>
      <p>Energy: {latest.energy_kwh} kWh</p>
      <p className="text-sm text-gray-500">Timestamp: {new Date(latest.timestamp).toLocaleString()}</p>
    </div>
  );
};

export default ModbusCard;
