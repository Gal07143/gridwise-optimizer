
export type WeatherCondition = 
  | 'sunny' 
  | 'cloudy' 
  | 'partly-cloudy' 
  | 'overcast' 
  | 'rainy' 
  | 'heavy-rain'
  | 'thunderstorm'
  | 'snowy'
  | 'foggy'
  | 'windy'
  | 'clear';

export interface WeatherData {
  condition: WeatherCondition;
  temperature: number;
  humidity: number;
  wind_speed: number;
  cloud_cover: number;
  precipitation: number;
  timestamp: string;
  location?: string;
  forecast?: WeatherForecast[];
}

export interface WeatherForecast {
  timestamp: string;
  condition: WeatherCondition;
  temperature: number;
  humidity: number;
  wind_speed: number;
  cloud_cover: number;
  precipitation: number;
}
