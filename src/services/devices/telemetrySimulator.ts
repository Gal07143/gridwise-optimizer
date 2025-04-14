
import { TelemetryMetric } from '@/components/telemetry/LiveTelemetryChart';

// Simple telemetry simulator for development and testing purposes
export function simulateTelemetry(deviceId: string, metric: TelemetryMetric = 'power', timeframe: string = '24h') {
  const now = new Date();
  const count = timeframeToDataPoints(timeframe);
  const data = [];
  
  const metrics = {
    power: { base: 5, variance: 2 },
    energy: { base: 100, variance: 20 },
    voltage: { base: 230, variance: 5 },
    current: { base: 10, variance: 2 },
    temperature: { base: 35, variance: 5 }
  };
  
  const metricConfig = metrics[metric as keyof typeof metrics] || metrics.power;
  const interval = timeframeToInterval(timeframe);
  
  for (let i = 0; i < count; i++) {
    const timestamp = new Date(now.getTime() - i * interval);
    const baseValue = metricConfig.base;
    const variance = metricConfig.variance;
    
    // Add some noise and patterns based on time of day
    const hour = timestamp.getHours();
    let timeModifier = 1;
    
    // Create pattern based on time of day (higher during peak hours)
    if (hour >= 7 && hour <= 9) timeModifier = 1.3; // Morning peak
    else if (hour >= 17 && hour <= 20) timeModifier = 1.5; // Evening peak
    else if (hour >= 23 || hour <= 5) timeModifier = 0.7; // Night time
    
    const noise = (Math.random() * 2 - 1) * variance;
    const value = (baseValue * timeModifier) + noise;
    
    data.push({
      timestamp: timestamp.toISOString(),
      value: Math.max(0, value), // Ensure no negative values for most metrics
      unit: getUnitForMetric(metric)
    });
  }
  
  return metric === 'energy' ? 
    data.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()) :
    data.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

// Simulate historical telemetry data for time series
export function simulateHistoricalTelemetry(
  deviceId: string,
  start: Date = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
  end: Date = new Date(),
  interval: number = 3600000, // hourly by default
  metrics: string[] = ['power', 'energy']
) {
  const data = [];
  const startTime = start.getTime();
  const endTime = end.getTime();
  
  let time = startTime;
  while (time <= endTime) {
    const point: any = {
      timestamp: new Date(time).toISOString(),
      device_id: deviceId
    };
    
    metrics.forEach(metric => {
      const hourOfDay = new Date(time).getHours();
      const baseValue = getBaseValueForMetric(metric);
      const variance = baseValue * 0.2;
      
      // Create realistic patterns
      let timeModifier = 1;
      if (metric === 'power' || metric === 'energy') {
        // Solar pattern: peak during day, low at night
        if (metric === 'power' && deviceId.includes('solar')) {
          if (hourOfDay >= 8 && hourOfDay <= 16) {
            const midpoint = 12;
            const distanceFromMid = Math.abs(hourOfDay - midpoint);
            timeModifier = 1 - (distanceFromMid / 8);
          } else {
            timeModifier = 0.1;
          }
        } 
        // Load pattern: peaks in morning and evening
        else {
          if (hourOfDay >= 7 && hourOfDay <= 9) timeModifier = 1.5;
          else if (hourOfDay >= 17 && hourOfDay <= 20) timeModifier = 1.8; 
          else if (hourOfDay >= 23 || hourOfDay <= 5) timeModifier = 0.6;
        }
      }
      
      const noise = (Math.random() * 2 - 1) * variance;
      const value = Math.max(0, baseValue * timeModifier + noise);
      
      point[metric] = value;
    });
    
    data.push(point);
    time += interval;
  }
  
  return data;
}

// Helper functions
function getUnitForMetric(metric: TelemetryMetric | string): string {
  switch (metric) {
    case 'power': return 'kW';
    case 'energy': return 'kWh';
    case 'voltage': return 'V';
    case 'current': return 'A';
    case 'temperature': return '°C';
    case 'state_of_charge': return '%';
    case 'frequency': return 'Hz';
    default: return '';
  }
}

function getBaseValueForMetric(metric: string): number {
  switch (metric) {
    case 'power': return 5;
    case 'energy': return 100;
    case 'voltage': return 230;
    case 'current': return 10;
    case 'temperature': return 35;
    case 'state_of_charge': return 70;
    case 'frequency': return 50;
    default: return 1;
  }
}

function timeframeToDataPoints(timeframe: string): number {
  switch (timeframe) {
    case '1h': return 60;
    case '3h': return 180;
    case '6h': return 360;
    case '12h': return 720;
    case '24h': return 288;
    case '7d': return 336;
    case '30d': return 720;
    default: return 288;
  }
}

function timeframeToInterval(timeframe: string): number {
  switch (timeframe) {
    case '1h': return 60 * 1000;
    case '3h': return 3 * 60 * 1000;
    case '6h': return 6 * 60 * 1000;
    case '12h': return 12 * 60 * 1000;
    case '24h': return 5 * 60 * 1000;
    case '7d': return 30 * 60 * 1000;
    case '30d': return 60 * 60 * 1000;
    default: return 5 * 60 * 1000;
  }
}
