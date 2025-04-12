
import { generateMockForecasts } from './sampleGenerator';
import { WeatherForecast } from '@/types/energy';

// Get forecast data for a site
export const fetchForecasts = async (timeframe: string = '24h', siteId?: string) => {
  try {
    // In a real app, this would be an API call
    const siteForecast = generateMockForecasts(siteId, timeframeToHours(timeframe));
    return siteForecast;
  } catch (error) {
    console.error('Error fetching forecasts:', error);
    throw error;
  }
};

// Helper to convert timeframe string to hours
function timeframeToHours(timeframe: string): number {
  switch (timeframe) {
    case '24h':
      return 24;
    case '48h':
      return 48;
    case '7d':
      return 168; // 7 * 24
    case '1h':
      return 1;
    default:
      return 24;
  }
}

// Get weather forecast data for a site
export const getWeatherForecast = async (siteId: string): Promise<WeatherForecast[]> => {
  try {
    // In a real app, this would be an API call to a weather service
    // For now, we'll generate some mock weather data
    const now = new Date();
    const forecasts: WeatherForecast[] = [];
    
    // Generate hourly forecasts for the next 7 days
    for (let i = 0; i < 168; i++) { // 24 hours * 7 days
      const forecastTime = new Date(now.getTime() + i * 60 * 60 * 1000);
      
      // Generate some realistic weather data with daily patterns
      const hour = forecastTime.getHours();
      const dayProgress = (hour - 6) / 24; // -0.25 at 6am, 0.75 at 6pm
      
      // Temperature varies by time of day
      const baseTemp = 15 + Math.sin(dayProgress * Math.PI) * 10;
      const dayVariation = Math.random() * 4 - 2; // +/- 2 degrees daily variation
      
      // Cloud cover varies too
      const cloudCover = Math.max(0, Math.min(100, 
        40 + Math.sin(dayProgress * Math.PI * 2) * 20 + Math.random() * 30
      ));
      
      // Determine weather condition based on cloud cover
      let weatherCondition: WeatherForecast['weather_condition'] = 'Clear';
      if (cloudCover > 80) weatherCondition = 'Overcast';
      else if (cloudCover > 60) weatherCondition = 'Cloudy';
      else if (cloudCover > 30) weatherCondition = 'Partially cloudy';
      else weatherCondition = 'Sunny';
      
      // Add some randomness for precipitation chance
      const precipitation = cloudCover > 60 ? Math.random() * 10 : 0;
      if (precipitation > 5) weatherCondition = 'Rainy';
      if (precipitation > 8 && Math.random() > 0.7) weatherCondition = 'Stormy';
      
      forecasts.push({
        timestamp: forecastTime.toISOString(),
        temperature: Math.round((baseTemp + dayVariation) * 10) / 10,
        weather_condition: weatherCondition,
        cloud_cover: Math.round(cloudCover),
        wind_speed: Math.round((5 + Math.random() * 15) * 10) / 10,
        precipitation: precipitation > 0 ? Math.round(precipitation * 10) / 10 : undefined,
        humidity: Math.round(50 + cloudCover / 4 + Math.random() * 10),
        pressure: Math.round(1000 + Math.random() * 30),
        solar_irradiance: calculateSolarIrradiance(hour, cloudCover)
      });
    }
    
    return forecasts;
  } catch (error) {
    console.error('Error fetching weather forecast:', error);
    throw error;
  }
};

// Helper function to calculate solar irradiance based on time of day and cloud cover
function calculateSolarIrradiance(hour: number, cloudCover: number): number {
  // No solar radiation at night
  if (hour < 6 || hour > 20) return 0;
  
  // Peak solar radiation at noon
  const timeOfDay = Math.sin(((hour - 6) / 14) * Math.PI);
  
  // Max radiation on a clear day is around 1000 W/m²
  const maxRadiation = 1000;
  
  // Clouds reduce radiation (0% cloud = 100% of max, 100% cloud = 20% of max)
  const cloudFactor = 1 - (cloudCover * 0.8 / 100);
  
  // Calculate and round to nearest 10
  return Math.round((timeOfDay * maxRadiation * cloudFactor) / 10) * 10;
}
