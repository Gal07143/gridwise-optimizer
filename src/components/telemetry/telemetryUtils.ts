
import { TelemetryMetric } from './LiveTelemetryChart';

/**
 * Format telemetry data for chart display
 */
export function formatTelemetryData(
  data: any[], 
  metric: TelemetryMetric
): { timestamp: string; value: number }[] {
  if (!data || !Array.isArray(data)) {
    return [];
  }
  
  return data.map(item => ({
    timestamp: item.timestamp,
    value: item[metric] !== undefined ? item[metric] : (item.value || 0)
  }));
}

/**
 * Get appropriate unit label for a metric
 */
export function getMetricUnit(metric: TelemetryMetric): string {
  switch (metric) {
    case 'power': return 'kW';
    case 'voltage': return 'V';
    case 'current': return 'A';
    case 'temperature': return '°C';
    case 'state_of_charge': return '%';
    default: return '';
  }
}

/**
 * Get an appropriate color for a metric
 */
export function getMetricColor(metric: TelemetryMetric): string {
  switch (metric) {
    case 'power': return '#10b981'; // Green
    case 'voltage': return '#3b82f6'; // Blue
    case 'current': return '#f97316'; // Orange
    case 'temperature': return '#ef4444'; // Red
    case 'state_of_charge': return '#8b5cf6'; // Purple
    default: return '#6b7280'; // Gray
  }
}

/**
 * Format telemetry value with the appropriate unit
 */
export function formatTelemetryValue(value: number, metric: TelemetryMetric): string {
  if (value === undefined || value === null) return 'N/A';
  
  switch (metric) {
    case 'power':
      return `${value.toFixed(2)} kW`;
    case 'voltage':
      return `${value.toFixed(1)} V`;
    case 'current':
      return `${value.toFixed(2)} A`;
    case 'temperature':
      return `${value.toFixed(1)} °C`;
    case 'state_of_charge':
      return `${Math.round(value)}%`;
    default:
      return `${value}`;
  }
}
