
// Helper functions for telemetry data formatting

export const formatTelemetryData = (data: any[]) => {
  if (!data || !Array.isArray(data)) return [];
  
  return data.map(item => ({
    timestamp: item.timestamp,
    value: item.value,
    unit: item.unit
  }));
};

// Format a value with its unit for display
export const formatValueWithUnit = (value: number, unit: string): string => {
  // Format based on unit type
  switch (unit) {
    case '%':
      return `${value.toFixed(1)}${unit}`;
    case 'W':
    case 'kW':
      return value >= 1000 ? `${(value / 1000).toFixed(2)} kW` : `${value.toFixed(0)} W`;
    case 'kWh':
      return `${value.toFixed(2)} ${unit}`;
    case '°C':
      return `${value.toFixed(1)}${unit}`;
    case 'V':
      return `${value.toFixed(1)} ${unit}`;
    case 'A':
      return `${value.toFixed(2)} ${unit}`;
    default:
      return `${value} ${unit}`;
  }
};

// Get a color based on the value (for visualizations)
export const getValueColor = (value: number, metric: string): string => {
  switch (metric) {
    case 'temperature':
      if (value > 55) return 'red';
      if (value > 45) return 'orange';
      return 'green';
    case 'state_of_charge':
      if (value < 20) return 'red';
      if (value < 40) return 'orange';
      return 'green';
    case 'voltage':
      if (value < 220 || value > 240) return 'red';
      return 'green';
    default:
      return 'blue';
  }
};
