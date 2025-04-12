
// This service simulates telemetry data for devices

// Sample telemetry data structure
export interface TelemetryData {
  timestamp: string;
  value: number;
  unit: string;
}

// Function to generate simulated telemetry data for a device
export const simulateTelemetry = (deviceId: string, metric: string, timeframe: string = '24h'): TelemetryData[] => {
  const now = new Date();
  const data: TelemetryData[] = [];
  
  let hoursToSimulate = 24;
  if (timeframe === '7d') hoursToSimulate = 168; // 7 * 24
  if (timeframe === '48h') hoursToSimulate = 48;
  if (timeframe === '1h') hoursToSimulate = 1;
  
  // Generate a data point for each hour (or more frequently for shorter timeframes)
  const intervalMinutes = timeframe === '1h' ? 5 : 60; // 5 minute intervals for 1h, hourly for longer timeframes
  const intervalsCount = hoursToSimulate * (60 / intervalMinutes);
  
  const baseValue = getBaseValueForMetric(metric, deviceId);
  const unit = getUnitForMetric(metric);
  
  for (let i = 0; i < intervalsCount; i++) {
    const timestamp = new Date(now.getTime() - i * intervalMinutes * 60 * 1000).toISOString();
    
    // Add some randomization to values to make them look realistic
    const randomFactor = 0.2; // 20% variation
    const randomVariation = (Math.random() * 2 - 1) * randomFactor * baseValue;
    
    // For power/energy metrics, simulate daily patterns (more energy during daylight hours)
    let timeOfDayFactor = 1;
    if (metric === 'power' || metric === 'energy') {
      const hour = new Date(timestamp).getHours();
      // Simulate solar production peaking at midday
      if (hour >= 6 && hour <= 18) {
        // Simple bell curve peaking at noon
        timeOfDayFactor = 1 - Math.abs(hour - 12) / 12;
      } else {
        timeOfDayFactor = 0.2; // Minimal at night
      }
    }
    
    const value = baseValue * timeOfDayFactor + randomVariation;
    
    data.push({
      timestamp,
      value: Number(Math.max(0, value).toFixed(2)), // Ensure non-negative values with 2 decimal places
      unit
    });
  }
  
  return data.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
};

// Helper function to determine base value for a metric based on device type
function getBaseValueForMetric(metric: string, deviceId: string): number {
  // In a real system, we'd get this from a configuration or device profile
  
  // Default values for different metrics
  switch (metric) {
    case 'power':
      return 5000; // 5kW
    case 'energy':
      return 20; // 20kWh
    case 'voltage':
      return 230; // 230V
    case 'current':
      return 10; // 10A
    case 'temperature':
      return 25; // 25°C
    case 'state_of_charge':
      return 75; // 75%
    default:
      return 100; // Default value
  }
}

// Helper function to determine unit for a metric
function getUnitForMetric(metric: string): string {
  switch (metric) {
    case 'power':
      return 'W';
    case 'energy':
      return 'kWh';
    case 'voltage':
      return 'V';
    case 'current':
      return 'A';
    case 'temperature':
      return '°C';
    case 'state_of_charge':
      return '%';
    case 'frequency':
      return 'Hz';
    case 'pressure':
      return 'bar';
    default:
      return '';
  }
}

// Function to get historical data for simulating longer trends
export const simulateHistoricalTelemetry = (
  deviceId: string, 
  metric: string, 
  timeframe: string = '24h'
): TelemetryData[] => {
  // Reuse the basic simulation function
  return simulateTelemetry(deviceId, metric, timeframe);
};
