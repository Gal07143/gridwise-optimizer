
/**
 * Get color for a specific metric type
 */
export const getMetricColor = (metric: string): string => {
  switch (metric) {
    case 'power': return '#4f46e5'; // indigo
    case 'voltage': return '#22c55e'; // green
    case 'current': return '#f97316'; // orange
    case 'temperature': return '#ef4444'; // red
    case 'state_of_charge': return '#8b5cf6'; // purple
    default: return '#3b82f6'; // blue
  }
};

/**
 * Get color for a data source
 */
export const getSourceColor = (source: string): string => {
  switch (source?.toLowerCase()) {
    case 'mqtt': return '#22c55e'; // green
    case 'modbus': return '#f97316'; // orange
    default: return '#3b82f6'; // blue
  }
};

/**
 * Format telemetry data for display in charts
 */
export const formatTelemetryData = (data: any[], metricKey: string) => {
  return data.map(entry => {
    const timeObj = new Date(entry.timestamp);
    return {
      time: timeObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timestamp: timeObj,
      value: entry[metricKey] ?? 0,
      source: entry.source || 'unknown'
    };
  }).sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
};
