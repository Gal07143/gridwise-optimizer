
import { WeatherForecast, ForecastDataPoint, ForecastMetrics } from '@/types/forecast';
import { EnergyForecast } from '@/types/energy';

// Get detailed weather forecast by site ID
export const getWeatherForecast = async (siteId: string): Promise<WeatherForecast[]> => {
  // In a real app, this would fetch from an API
  const now = new Date();
  const forecasts: WeatherForecast[] = [];
  
  // Generate 24 hours of forecast data
  for (let i = 0; i < 24; i++) {
    const timestamp = new Date(now.getTime() + i * 60 * 60 * 1000);
    const hour = timestamp.getHours();
    
    // Simulate day/night pattern for temperature and irradiance
    const isDaytime = hour >= 6 && hour <= 18;
    const temperature = isDaytime ? 
      20 + Math.sin((hour - 6) * Math.PI / 12) * 8 : // Day: 12-28°C curve
      12 + Math.sin((hour - 18) * Math.PI / 12) * 4; // Night: 8-16°C curve
    
    const irradiance = isDaytime ? 
      Math.sin((hour - 6) * Math.PI / 12) * 800 : // Peak at noon
      0; // No solar irradiance at night
    
    forecasts.push({
      site_id: siteId,
      timestamp: timestamp.toISOString(),
      temperature: Math.round(temperature * 10) / 10,
      humidity: Math.floor(50 + Math.random() * 30),
      wind_speed: Math.floor(5 + Math.random() * 15),
      cloud_cover: Math.floor(Math.random() * 100),
      precipitation: Math.random() * 0.3,
      weather_condition: isDaytime ? 'partly_cloudy' : 'clear',
      solar_irradiance: Math.max(0, Math.round(irradiance))
    });
  }
  
  return forecasts;
};

// Alternative name for getWeatherForecast for backward compatibility
export const fetchWeatherForecast = getWeatherForecast;

// Get energy forecasts (production, consumption, etc.)
export const getEnergyForecasts = async (siteId: string): Promise<EnergyForecast[]> => {
  // In a real app, this would fetch from an API
  const now = new Date();
  const forecasts: EnergyForecast[] = [];
  
  // Generate 24 hours of forecast data
  for (let i = 0; i < 24; i++) {
    const timestamp = new Date(now.getTime() + i * 60 * 60 * 1000);
    const hour = timestamp.getHours();
    
    // Simulate day/night pattern
    const isDaytime = hour >= 6 && hour <= 18;
    
    // Simulated production (solar)
    const production = isDaytime ? 
      Math.sin((hour - 6) * Math.PI / 12) * 10 : // Peak at noon
      0; // No production at night
    
    // Simulated consumption
    const consumption = 2 + Math.sin((hour) * Math.PI / 12) * 3; // Higher in evening
    
    forecasts.push({
      site_id: siteId,
      timestamp: timestamp.toISOString(),
      forecasted_production: Math.round(production * 10) / 10,
      forecasted_consumption: Math.round(consumption * 10) / 10,
      confidence: 0.8 - (i / 24 * 0.4), // Confidence decreases over time
    });
  }
  
  return forecasts;
};
