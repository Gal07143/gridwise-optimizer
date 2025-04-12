
export interface WeatherForecast {
  id?: string;
  site_id: string;
  timestamp: string;
  temperature: number;
  humidity: number;
  wind_speed: number;
  cloud_cover: number;
  precipitation: number;
  weather_condition: WeatherCondition;
  solar_irradiance: number;
  created_at?: string;
}

export type WeatherCondition = 
  | 'clear'
  | 'partly_cloudy'
  | 'cloudy'
  | 'overcast'
  | 'light_rain'
  | 'rain'
  | 'heavy_rain'
  | 'thunderstorm'
  | 'snow'
  | 'fog';

export interface ForecastDataPoint {
  timestamp: string;
  value: number;
  forecasted: boolean;
}

export interface ForecastMetrics {
  production: ForecastDataPoint[];
  consumption: ForecastDataPoint[];
  batteryCharge: ForecastDataPoint[];
  gridImport: ForecastDataPoint[];
  gridExport: ForecastDataPoint[];
}
