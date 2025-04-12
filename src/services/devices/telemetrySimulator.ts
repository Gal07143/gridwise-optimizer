
import { EnergyReading } from "@/types/energy";

/**
 * Simulate real-time telemetry for a device
 */
export const simulateTelemetry = (deviceId: string, parameter?: string): EnergyReading => {
  const timestamp = new Date().toISOString();
  
  return {
    id: `telemetry-${Date.now()}`,
    device_id: deviceId,
    timestamp,
    power: Math.random() * 10 + 2,
    energy: Math.random() * 24,
    voltage: Math.random() * 10 + 235,
    current: Math.random() * 10 + 5,
    frequency: 50 + (Math.random() * 0.5 - 0.25),
    temperature: Math.random() * 10 + 30,
    state_of_charge: Math.floor(Math.random() * 100)
  };
};

/**
 * Simulate historical telemetry data for a device
 */
export const simulateHistoricalTelemetry = (
  deviceId: string, 
  hours = 24, 
  interval = 3600000
): EnergyReading[] => {
  const now = Date.now();
  const readings: EnergyReading[] = [];
  
  for (let i = 0; i < hours; i++) {
    const timestamp = new Date(now - (i * interval)).toISOString();
    readings.push({
      id: `hist-${i}-${deviceId}`,
      device_id: deviceId,
      timestamp,
      power: Math.random() * 10 + 2,
      energy: Math.random() * (i + 1) * 0.5,
      voltage: Math.random() * 10 + 235,
      current: Math.random() * 10 + 5,
      frequency: 50 + (Math.random() * 0.5 - 0.25),
      temperature: Math.random() * 10 + 30,
      state_of_charge: Math.min(100, 20 + i * 3 + Math.floor(Math.random() * 5))
    });
  }
  
  return readings;
};
