
export interface Asset {
  id: string;
  name: string;
  type: string;
  capacity: number;
  status: string;
  lastUpdated: string;
}

export interface GridSignal {
  id: string;
  timestamp: string;
  type: string;
  source: string;
  priority: string;
  value: number;
  duration: number;
  status: string;
}

// Add these new interfaces for EnergyOptimizationVisualization
export interface EnergyPrediction {
  timestamp: Date;
  consumption: number;
  generation: number;
  battery_level: number;
}

export interface EnergyAction {
  type: 'charge' | 'discharge' | 'idle';
  value: number;
  reason: string;
  savings: number;
}

// Add types for WeatherImpact to ensure it's properly typed
export interface WeatherForecast {
  date: string;
  timestamp?: string; // For compatibility
  temperature: number;
  conditions: string;
  solarIrradiance: number;
  cloudCover?: number;
  precipitation?: number;
}

export interface WeatherImpact {
  temperature: number;
  irradiance: number;
  cloud_cover: number;
  wind_speed: number;
  precipitation: number;
  humidity: number;
  cloudCover: number;
  forecast: WeatherForecast[];
}

export interface BatteryStatus {
  currentLevel: number;
  capacity: number;
  maxChargeRate: number;
  maxDischargeRate: number;
  efficiency: number;
  initialLevel?: number;
  minLevel?: number;
  maxLevel?: number;
  maxCyclesPerDay?: number;
}
