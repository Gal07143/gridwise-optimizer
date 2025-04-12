
export type WeatherCondition = 'Clear' | 'Cloudy' | 'Rainy' | 'Sunny' | 'Partially cloudy' | 'Overcast' | 'Stormy';

export interface WeatherForecast {
  timestamp: string;
  temperature: number;
  weather_condition: WeatherCondition;
  cloud_cover: number;
  wind_speed: number;
  precipitation?: number;
  humidity?: number;
  pressure?: number;
}

export interface EnergyReading {
  device_id: string;
  timestamp: string;
  value: number;
  unit: string;
}

export interface ForecastMetrics {
  totalGeneration: number;
  totalConsumption: number;
  netEnergy: number;
  peakGeneration: number;
  peakConsumption: number;
  selfConsumptionRate: number;
  confidence?: number;
}

export interface ProcessedForecastData {
  timestamp: string;
  production: number;
  consumption: number;
  balance?: number;
}

export type DeviceType = 'solar' | 'battery' | 'grid' | 'ev_charger' | 'meter' | 'inverter' | 'load' | 'generator' | 'wind' | 'hydro' | 'home';

export type DeviceStatus = 'online' | 'offline' | 'error' | 'warning' | 'maintenance' | 'inactive' | 'active';

export interface EnergyDevice {
  id: string;
  name: string;
  type: DeviceType;
  status: DeviceStatus;
  location?: string;
  manufacturer?: string;
  model?: string;
  power?: number;
  capacity?: number;
  last_reading?: number;
  last_reading_unit?: string;
  installation_date?: string;
  firmware_version?: string;
  serial_number?: string;
  description?: string;
}
