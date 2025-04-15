
import { TelemetryData } from '@/types/telemetry';

/**
 * Helper function to get the latest telemetry data for a device
 * from a telemetry array
 */
export const getLatestTelemetry = (telemetry: TelemetryData[] | undefined): TelemetryData | null => {
  if (!telemetry || telemetry.length === 0) {
    return null;
  }
  return telemetry[0];
};

/**
 * Helper function to extract a specific parameter value from telemetry data
 */
export const getTelemetryValue = (
  telemetry: TelemetryData[] | undefined, 
  parameter: string, 
  defaultValue: number = 0
): number => {
  if (!telemetry || telemetry.length === 0) {
    return defaultValue;
  }

  const match = telemetry.find(t => t.parameter === parameter);
  if (match && typeof match.value === 'number') {
    return match.value;
  }
  return defaultValue;
};

/**
 * Get telemetry data for a specific metric from the data object
 */
export const getTelemetryDataValue = (
  telemetry: TelemetryData | null,
  dataKey: string,
  defaultValue: number = 0
): number => {
  if (!telemetry || !telemetry.data || typeof telemetry.data[dataKey] === 'undefined') {
    return defaultValue;
  }
  
  const value = telemetry.data[dataKey];
  return typeof value === 'number' ? value : defaultValue;
};
