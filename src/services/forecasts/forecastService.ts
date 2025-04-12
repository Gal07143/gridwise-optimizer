
import { EnergyForecast } from '@/types/energy-forecast';
import { WeatherForecast } from '@/types/forecast';
import { generateMockForecasts, generateWeatherForecasts } from './sampleGenerator';
import { toast } from 'sonner';

// Fetch energy forecasts (solar and consumption)
export async function getEnergyForecasts(siteId: string = 'site-1'): Promise<EnergyForecast[]> {
  try {
    console.log(`Fetching energy forecasts for site ${siteId}`);
    
    // In a real app, this would be an API call
    // For now we'll simulate with mock data
    const mockForecasts = generateMockForecasts(siteId, 48);
    
    return mockForecasts;
  } catch (error) {
    console.error('Error fetching energy forecasts:', error);
    toast.error('Failed to load energy forecasts');
    return [];
  }
}

// Fetch weather forecasts
export async function getWeatherForecast(siteId: string = 'site-1'): Promise<WeatherForecast[]> {
  try {
    console.log(`Fetching weather forecast for site ${siteId}`);
    
    // Mock weather data
    const weatherForecasts = generateWeatherForecasts(siteId, 24);
    
    return weatherForecasts;
  } catch (error) {
    console.error('Error fetching weather forecast:', error);
    toast.error('Failed to load weather forecast');
    return [];
  }
}

// Get forecast for a specific day
export async function getDailyForecast(siteId: string, date: string): Promise<EnergyForecast[]> {
  try {
    console.log(`Fetching forecast for site ${siteId} on ${date}`);
    
    // Mock data for specific day
    const mockForecasts = generateMockForecasts(siteId, 24).map(forecast => {
      // Adjust the timestamp to match the requested date
      const forecastDate = new Date(date);
      const forecastTime = new Date(forecast.forecast_time);
      forecastDate.setHours(forecastTime.getHours(), forecastTime.getMinutes());
      
      return {
        ...forecast,
        forecast_time: forecastDate.toISOString(),
        timestamp: forecastDate.toISOString()
      };
    });
    
    return mockForecasts;
  } catch (error) {
    console.error(`Error fetching forecast for ${date}:`, error);
    toast.error('Failed to load daily forecast');
    return [];
  }
}

// Enable forecasted_production and forecasted_consumption for compatibility
export function enrichForecast(forecast: EnergyForecast): EnergyForecast {
  return {
    ...forecast,
    forecasted_production: forecast.generation_forecast,
    forecasted_consumption: forecast.consumption_forecast,
    weather_condition: forecast.weather_condition || 'Clear'
  };
}
