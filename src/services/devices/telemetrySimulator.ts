
import { TelemetryMetric } from '@/components/telemetry/LiveTelemetryChart';

interface TelemetryData {
  timestamp: string;
  value: number;
  unit: string;
}

// Generate random telemetry data based on the device and metric
export const simulateTelemetry = (deviceId: string, metric: TelemetryMetric, timeframe: string): TelemetryData[] => {
  // Parse the timeframe to determine how many data points to generate
  const hours = timeframe.includes('h') ? parseInt(timeframe) : 24;
  const pointsCount = hours * 12; // 5-minute intervals
  
  // Set appropriate ranges and units based on the metric
  const ranges: Record<string, { min: number; max: number; unit: string }> = {
    power: { min: 0, max: 5000, unit: 'W' },
    voltage: { min: 220, max: 240, unit: 'V' },
    current: { min: 0, max: 20, unit: 'A' },
    temperature: { min: 20, max: 60, unit: '°C' },
    state_of_charge: { min: 0, max: 100, unit: '%' },
    frequency: { min: 49.5, max: 50.5, unit: 'Hz' },
    irradiance: { min: 0, max: 1200, unit: 'W/m²' },
    humidity: { min: 30, max: 80, unit: '%' }
  };

  const range = ranges[metric] || { min: 0, max: 100, unit: '' };
  
  // Create data points
  const now = new Date();
  const data: TelemetryData[] = [];
  
  for (let i = 0; i < pointsCount; i++) {
    const timestamp = new Date(now.getTime() - (pointsCount - i) * 5 * 60 * 1000);
    
    // Create pattern based on device ID hash to make it consistent for the same device
    const deviceHash = hashCode(deviceId);
    const baseValue = range.min + (range.max - range.min) * (0.3 + (Math.sin((i / pointsCount) * Math.PI * 2 + deviceHash) + 1) / 4);
    
    // Add some randomness
    const randomFactor = 0.05; // 5% randomness
    const randomValue = baseValue * (1 + (Math.random() - 0.5) * 2 * randomFactor);
    
    // Ensure within range
    const finalValue = Math.max(range.min, Math.min(range.max, randomValue));
    
    data.push({
      timestamp: timestamp.toISOString(),
      value: Number(finalValue.toFixed(2)),
      unit: range.unit
    });
  }
  
  return data;
};

// Helper function to generate a numeric hash from a string
const hashCode = (str: string): number => {
  let hash = 0;
  if (str.length === 0) return hash;
  
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0; // Convert to 32bit integer
  }
  
  return hash;
};

// Function to format telemetry data for charts
export const formatTelemetryData = (data: TelemetryData[]) => {
  return data.map(item => ({
    timestamp: item.timestamp,
    value: item.value,
    unit: item.unit
  }));
};
