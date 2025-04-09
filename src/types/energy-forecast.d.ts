
export interface EnergyForecast {
  id: string;
  site_id: string;
  timestamp: string;
  forecast_time: string;
  generation_forecast: number;
  consumption_forecast: number;
  temperature?: number;
  cloud_cover?: number;
  wind_speed?: number;
  confidence?: number;
  created_at: string;
  source: string;
  weather_condition?: string; // Add this property
}
