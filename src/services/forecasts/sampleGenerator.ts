
import { WeatherCondition, WeatherForecast } from '@/types/energy';

// Function to generate a random weather condition from the allowed types
const getWeatherCondition = (): WeatherCondition => {
  const conditions: WeatherCondition[] = [
    'Clear', 'Cloudy', 'Rainy', 'Sunny', 'Partially cloudy', 'Overcast', 'Stormy'
  ];
  return conditions[Math.floor(Math.random() * conditions.length)];
};

export const generateMockForecasts = (siteId: string = 'default', hours: number = 24): any[] => {
  const now = Date.now();
  const forecasts = [];
  for (let i = 0; i < hours; i++) {
    const timestamp = now + i * 3600000; // One hour interval
    const generation = Math.floor(Math.random() * 100); // 0-100 kWh
    const consumption = Math.floor(Math.random() * 50);  // 0-50 kWh
    const temperature = Math.floor(Math.random() * 20) + 15; // 15-35 degrees Celsius
    const cloudCover = Math.floor(Math.random() * 100); // 0-100%
    const windSpeed = Math.floor(Math.random() * 15); // 0-15 m/s
    
    // Use the properly typed weather condition
    const weatherCondition: WeatherCondition = getWeatherCondition();
    
    // Make sure there's no forecast_time property
    forecasts.push({
      site_id: siteId,
      timestamp: new Date(timestamp).toISOString(),
      generation_forecast: generation,
      consumption_forecast: consumption,
      weather_condition: weatherCondition,
      temperature: temperature,
      cloud_cover: cloudCover,
      wind_speed: windSpeed,
      probability: Math.random() * 100
    });
  }
  
  return forecasts;
};

// Generate weather forecasts with more detailed weather information
export const generateWeatherForecasts = (siteId: string = 'default', hours: number = 24): WeatherForecast[] => {
  const now = Date.now();
  const forecasts: WeatherForecast[] = [];
  
  for (let i = 0; i < hours; i++) {
    const timestamp = now + i * 3600000; // One hour interval
    const temperature = Math.floor(Math.random() * 20) + 15; // 15-35 degrees Celsius
    const cloudCover = Math.floor(Math.random() * 100); // 0-100%
    const windSpeed = Math.floor(Math.random() * 15); // 0-15 m/s
    const humidity = Math.floor(Math.random() * 40) + 40; // 40-80%
    const pressure = Math.floor(Math.random() * 30) + 980; // 980-1010 hPa
    const precipitation = Math.random() < 0.3 ? Math.random() * 5 : 0; // 30% chance of precipitation
    
    // Use the properly typed weather condition
    const weatherCondition: WeatherCondition = getWeatherCondition();
    
    forecasts.push({
      timestamp: new Date(timestamp).toISOString(),
      temperature,
      weather_condition: weatherCondition,
      cloud_cover: cloudCover,
      wind_speed: windSpeed,
      precipitation,
      humidity,
      pressure
    });
  }
  
  return forecasts;
};
