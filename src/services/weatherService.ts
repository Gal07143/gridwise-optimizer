
import { supabase } from '@/lib/supabase';
import { subHours, addHours, format } from 'date-fns';

// Sample weather conditions
const weatherConditions = [
  'Sunny', 'Clear', 'Partly Cloudy', 'Cloudy', 
  'Overcast', 'Light Rain', 'Rain', 'Thunderstorm',
  'Snow', 'Fog', 'Mist'
];

// Generate a random sample of weather data
export const fetchWeatherForecast = async (siteId?: string) => {
  try {
    // In a real application, this would be a call to your backend API
    // For demonstration, we'll generate mock data
    
    // Check if we have data in the database
    if (siteId) {
      const { data, error } = await supabase
        .from('weather_data')
        .select('*')
        .eq('site_id', siteId)
        .eq('forecast', true)
        .order('timestamp', { ascending: true })
        .limit(24);
      
      if (data && data.length > 0 && !error) {
        return data.map(item => ({
          timestamp: item.timestamp,
          temperature: item.temperature || 20,
          humidity: item.humidity || 50,
          wind_speed: item.wind_speed || 5,
          condition: getWeatherCondition(item.cloud_cover || 0, item.precipitation || 0),
          precipitation: item.precipitation || 0,
          cloud_cover: item.cloud_cover || 0,
          solar_irradiance: calculateSolarIrradiance(item.cloud_cover || 0, new Date(item.timestamp))
        }));
      }
    }
    
    // If no data in database, generate mock data
    return generateMockWeatherData();
  } catch (error) {
    console.error('Error fetching weather forecast:', error);
    return generateMockWeatherData();
  }
};

// Generate mock weather data with realistic patterns
const generateMockWeatherData = () => {
  const now = new Date();
  const data = [];
  
  // Base values
  let baseTemp = 15 + Math.random() * 10; // Base temperature between 15-25°C
  let baseHumidity = 50 + Math.random() * 30; // Base humidity between 50-80%
  let baseWindSpeed = 2 + Math.random() * 6; // Base wind speed between 2-8 m/s
  let baseCloudCover = Math.random() * 100; // Base cloud cover 0-100%
  let basePrecipitation = Math.random() * 2; // Base precipitation 0-2mm
  
  // Generate 24 hour forecast
  for (let i = 0; i < 24; i++) {
    // Time for this data point
    const timestamp = addHours(now, i);
    
    // Daily variation (temperature higher during day, lower at night)
    const hour = timestamp.getHours();
    const isDaytime = hour >= 6 && hour <= 18;
    const tempVariation = isDaytime ? 2 + Math.random() * 3 : -(Math.random() * 3);
    const temperature = Math.max(0, Math.min(40, baseTemp + tempVariation));
    
    // Cloud cover and precipitation tend to be correlated
    let cloudCover = baseCloudCover + (Math.random() * 40 - 20);
    cloudCover = Math.max(0, Math.min(100, cloudCover));
    
    let precipitation = 0;
    if (cloudCover > 60) {
      precipitation = basePrecipitation * (cloudCover / 100) * Math.random();
    }
    
    // Wind speed and humidity variations
    const windSpeed = Math.max(0, baseWindSpeed + (Math.random() * 2 - 1));
    const humidity = Math.max(10, Math.min(100, baseHumidity + (Math.random() * 10 - 5)));
    
    // Solar irradiance based on time of day and cloud cover
    const solarIrradiance = calculateSolarIrradiance(cloudCover, timestamp);
    
    // Determine weather condition based on cloud cover and precipitation
    const condition = getWeatherCondition(cloudCover, precipitation);
    
    data.push({
      timestamp: timestamp.toISOString(),
      temperature,
      humidity,
      wind_speed: windSpeed,
      condition,
      precipitation,
      cloud_cover: cloudCover,
      solar_irradiance: solarIrradiance
    });
    
    // Slightly adjust base values for next hour (weather tends to change gradually)
    baseTemp += (Math.random() * 0.6 - 0.3);
    baseHumidity += (Math.random() * 4 - 2);
    baseWindSpeed += (Math.random() * 0.6 - 0.3);
    baseCloudCover += (Math.random() * 10 - 5);
    basePrecipitation += (Math.random() * 0.4 - 0.2);
  }
  
  return data;
};

// Helper to calculate solar irradiance
const calculateSolarIrradiance = (cloudCover: number, timestamp: Date) => {
  const hour = timestamp.getHours();
  
  // No solar radiation at night
  if (hour < 5 || hour > 21) return 0;
  
  // Peak at noon
  const hourFactor = 1 - Math.abs(hour - 13) / 8;
  
  // Cloud cover reduces solar radiation
  const cloudFactor = 1 - (cloudCover / 100) * 0.8;
  
  // Max irradiance around 1000 W/m²
  return Math.max(0, Math.round(hourFactor * cloudFactor * 1000));
};

// Helper to determine weather condition
const getWeatherCondition = (cloudCover: number, precipitation: number) => {
  if (precipitation > 1.5) return 'Thunderstorm';
  if (precipitation > 0.5) return 'Rain';
  if (precipitation > 0.1) return 'Light Rain';
  if (cloudCover > 80) return 'Overcast';
  if (cloudCover > 50) return 'Cloudy';
  if (cloudCover > 20) return 'Partly Cloudy';
  return 'Sunny';
};

export const getWeatherIcon = (condition: string) => {
  // This function would return the appropriate icon for the weather condition
  // In a real app, you might return different icon components
  return condition;
};
