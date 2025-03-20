
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface WeatherData {
  id?: string;
  site_id: string;
  timestamp: string;
  forecast: boolean;
  temperature?: number;
  humidity?: number;
  precipitation?: number;
  wind_speed?: number;
  wind_direction?: number;
  cloud_cover?: number;
  source?: string;
  conditions?: string; // Friendly description
}

export interface WeatherForecast {
  daily: WeatherData[];
  hourly: WeatherData[];
}

/**
 * Get current weather for a site
 */
export const getCurrentWeather = async (siteId: string): Promise<WeatherData | null> => {
  try {
    console.log(`Fetching current weather for site ${siteId}`);
    
    // Try to get from database first (most recent non-forecast data)
    const { data, error } = await supabase
      .from('weather_data')
      .select('*')
      .eq('site_id', siteId)
      .eq('forecast', false)
      .order('timestamp', { ascending: false })
      .limit(1);
    
    if (error) {
      console.error("Error fetching weather data:", error);
      throw error;
    }
    
    // If we have recent data (less than 1 hour old), use it
    if (data && data.length > 0) {
      const lastUpdate = new Date(data[0].timestamp);
      const now = new Date();
      const diffMs = now.getTime() - lastUpdate.getTime();
      const diffHours = diffMs / (1000 * 60 * 60);
      
      if (diffHours < 1) {
        console.log("Using recent weather data from database");
        // Add a friendly conditions description
        const weatherData = data[0] as WeatherData;
        weatherData.conditions = getWeatherConditionsDescription(weatherData);
        return weatherData;
      }
    }
    
    // If no recent data, fetch from API (simulated)
    console.log("Fetching fresh weather data from API");
    const weatherData = await fetchWeatherFromAPI(siteId);
    
    // Store in database
    if (weatherData) {
      const { error: insertError } = await supabase
        .from('weather_data')
        .upsert({
          site_id: siteId,
          timestamp: new Date().toISOString(),
          forecast: false,
          temperature: weatherData.temperature,
          humidity: weatherData.humidity,
          precipitation: weatherData.precipitation,
          wind_speed: weatherData.wind_speed,
          wind_direction: weatherData.wind_direction,
          cloud_cover: weatherData.cloud_cover,
          source: 'google_weather_api'
        }, {
          onConflict: 'site_id,timestamp,forecast'
        });
      
      if (insertError) {
        console.error("Error storing weather data:", insertError);
      }
    }
    
    return weatherData;
  } catch (error) {
    console.error("Error in weather service:", error);
    toast.error("Failed to fetch current weather data");
    return null;
  }
};

/**
 * Get weather forecast for a site
 */
export const getWeatherForecast = async (siteId: string, days: number = 5): Promise<WeatherForecast> => {
  try {
    console.log(`Fetching ${days}-day weather forecast for site ${siteId}`);
    
    // Try to get from database first
    const { data, error } = await supabase
      .from('weather_data')
      .select('*')
      .eq('site_id', siteId)
      .eq('forecast', true)
      .gte('timestamp', new Date().toISOString()) // Only future forecasts
      .order('timestamp', { ascending: true });
    
    if (error) {
      console.error("Error fetching weather forecast:", error);
      throw error;
    }
    
    // If we have recent forecast data, use it
    if (data && data.length > 0) {
      const now = new Date();
      const lastGeneratedTimestamp = data[0].timestamp;
      const lastGenerated = new Date(lastGeneratedTimestamp);
      const diffMs = now.getTime() - lastGenerated.getTime();
      const diffHours = diffMs / (1000 * 60 * 60);
      
      if (diffHours < 6 && data.length >= days * 8) { // At least 8 data points per day
        console.log("Using recent forecast data from database");
        
        // Process data into daily and hourly forecasts
        return processWeatherForecastData(data as WeatherData[]);
      }
    }
    
    // If no recent data, fetch from API (simulated)
    console.log("Fetching fresh forecast data from API");
    const forecast = await fetchForecastFromAPI(siteId, days);
    
    // Store in database
    if (forecast.hourly.length > 0) {
      const forecastRecords = [...forecast.hourly];
      
      // Batch insert in chunks of 50
      const chunkSize = 50;
      for (let i = 0; i < forecastRecords.length; i += chunkSize) {
        const chunk = forecastRecords.slice(i, i + chunkSize);
        
        const { error: insertError } = await supabase
          .from('weather_data')
          .upsert(chunk, {
            onConflict: 'site_id,timestamp,forecast'
          });
        
        if (insertError) {
          console.error(`Error storing forecast chunk ${i}:`, insertError);
        }
      }
    }
    
    return forecast;
  } catch (error) {
    console.error("Error in weather forecast service:", error);
    toast.error("Failed to fetch weather forecast data");
    
    // Return empty forecast
    return {
      daily: [],
      hourly: []
    };
  }
};

/**
 * Process raw forecast data into daily and hourly formats
 */
const processWeatherForecastData = (data: WeatherData[]): WeatherForecast => {
  // Group by day
  const dailyMap = new Map<string, WeatherData[]>();
  
  data.forEach(item => {
    const date = new Date(item.timestamp).toISOString().split('T')[0];
    if (!dailyMap.has(date)) {
      dailyMap.set(date, []);
    }
    dailyMap.get(date)!.push(item);
  });
  
  // Create daily summaries
  const daily: WeatherData[] = [];
  
  dailyMap.forEach((items, date) => {
    // Calculate averages
    const avgTemp = items.reduce((sum, item) => sum + (item.temperature || 0), 0) / items.length;
    const maxTemp = Math.max(...items.map(item => item.temperature || 0));
    const minTemp = Math.min(...items.map(item => item.temperature || 0));
    const avgHumidity = items.reduce((sum, item) => sum + (item.humidity || 0), 0) / items.length;
    const avgWindSpeed = items.reduce((sum, item) => sum + (item.wind_speed || 0), 0) / items.length;
    const avgCloudCover = items.reduce((sum, item) => sum + (item.cloud_cover || 0), 0) / items.length;
    
    // Create daily summary
    const summary: WeatherData = {
      site_id: items[0].site_id,
      timestamp: `${date}T12:00:00Z`, // Noon on the day
      forecast: true,
      temperature: Number(avgTemp.toFixed(1)),
      humidity: Number(avgHumidity.toFixed(1)),
      wind_speed: Number(avgWindSpeed.toFixed(1)),
      cloud_cover: Number(avgCloudCover.toFixed(1)),
      source: items[0].source,
      // Add high/low temps in the conditions
      conditions: getWeatherConditionsDescription({
        ...items[0],
        temperature: avgTemp,
        cloud_cover: avgCloudCover
      }) + ` (High: ${maxTemp.toFixed(1)}°C, Low: ${minTemp.toFixed(1)}°C)`
    };
    
    daily.push(summary);
  });
  
  // Add conditions to hourly data
  const hourly = data.map(item => ({
    ...item,
    conditions: getWeatherConditionsDescription(item)
  }));
  
  return {
    daily: daily.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()),
    hourly: hourly.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
  };
};

/**
 * Get a friendly description of weather conditions
 */
const getWeatherConditionsDescription = (weather: WeatherData): string => {
  if (!weather) return 'Unknown';
  
  const temp = weather.temperature;
  const cloudCover = weather.cloud_cover;
  const precipitation = weather.precipitation;
  const windSpeed = weather.wind_speed;
  
  if (precipitation && precipitation > 5) {
    return 'Heavy Rain';
  } else if (precipitation && precipitation > 1) {
    return 'Light Rain';
  } else if (cloudCover && cloudCover > 80) {
    return 'Overcast';
  } else if (cloudCover && cloudCover > 50) {
    return 'Partly Cloudy';
  } else if (cloudCover && cloudCover > 20) {
    return 'Mostly Clear';
  } else {
    return 'Clear Sky';
  }
};

/**
 * Simulate fetching current weather from an API
 * In a real app, this would call a weather API
 */
const fetchWeatherFromAPI = async (siteId: string): Promise<WeatherData> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Get site location
  const { data: site } = await supabase
    .from('sites')
    .select('lat, lng, timezone')
    .eq('id', siteId)
    .single();
  
  // Generate realistic weather based on location and time
  const now = new Date();
  const hour = now.getHours();
  
  // Temperature varies by time of day
  let baseTemp = 20; // Default base temp in °C
  if (hour >= 5 && hour <= 12) {
    // Morning warming up
    baseTemp = 15 + (hour - 5) * 1.5;
  } else if (hour > 12 && hour <= 18) {
    // Afternoon cooling down
    baseTemp = 25 - (hour - 12) * 0.5;
  } else {
    // Night
    baseTemp = 15;
  }
  
  // Add some randomness
  const temp = baseTemp + (Math.random() * 6 - 3);
  
  // Clouds and precipitation
  const cloudCover = Math.random() * 100;
  const precipitation = cloudCover > 70 ? Math.random() * 10 : 0;
  
  // Wind
  const windSpeed = 5 + Math.random() * 15;
  const windDirection = Math.random() * 360;
  
  // Humidity (higher when raining or at night)
  const humidity = precipitation > 0 
    ? 70 + Math.random() * 20 
    : (hour >= 10 && hour <= 17) 
      ? 40 + Math.random() * 30 
      : 60 + Math.random() * 20;
  
  return {
    site_id: siteId,
    timestamp: now.toISOString(),
    forecast: false,
    temperature: Number(temp.toFixed(1)),
    humidity: Number(humidity.toFixed(1)),
    precipitation: Number(precipitation.toFixed(1)),
    wind_speed: Number(windSpeed.toFixed(1)),
    wind_direction: Number(windDirection.toFixed(1)),
    cloud_cover: Number(cloudCover.toFixed(1)),
    source: 'google_weather_api'
  };
};

/**
 * Simulate fetching weather forecast from an API
 * In a real app, this would call a weather API
 */
const fetchForecastFromAPI = async (siteId: string, days: number): Promise<WeatherForecast> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Get site location
  const { data: site } = await supabase
    .from('sites')
    .select('lat, lng, timezone')
    .eq('id', siteId)
    .single();
  
  const hourly: WeatherData[] = [];
  const daily: WeatherData[] = [];
  
  const now = new Date();
  
  // Generate forecast for each day
  for (let d = 0; d < days; d++) {
    const date = new Date(now);
    date.setDate(date.getDate() + d);
    const dateStr = date.toISOString().split('T')[0];
    
    // Base temperature for the day (more variation as we go further out)
    const variance = d * 1.5;
    const baseDayTemp = 20 + (Math.random() * 10 - 5) + (Math.random() * variance - variance/2);
    
    // Weather pattern for the day (more uncertainty as we go further out)
    const pattern = Math.random() * 4;
    let dayClouds = 20 + (Math.random() * 60);
    let dayPrecip = dayClouds > 60 ? (Math.random() * 8) : 0;
    
    // Add randomness based on forecast day
    dayClouds += (Math.random() * variance * 10 - variance * 5);
    dayClouds = Math.max(0, Math.min(100, dayClouds));
    
    // Generate hourly forecasts
    for (let h = 0; h < 24; h++) {
      const hourDate = new Date(date);
      hourDate.setHours(h, 0, 0, 0);
      
      // Temperature varies through the day
      let hourTemp = baseDayTemp;
      if (h >= 0 && h < 6) {
        // Early morning (coolest)
        hourTemp -= 5 - (h * 0.5);
      } else if (h >= 6 && h < 14) {
        // Morning to afternoon (warming)
        hourTemp += (h - 6) * 0.7;
      } else if (h >= 14 && h < 19) {
        // Late afternoon to evening (cooling)
        hourTemp += 5 - ((h - 14) * 1);
      } else {
        // Night (cooling)
        hourTemp -= (h - 19) * 0.5;
      }
      
      // Cloud cover varies through the day
      let hourClouds = dayClouds;
      if (pattern < 1) {
        // Clear morning, cloudy afternoon
        hourClouds = h < 12 ? dayClouds * 0.6 : dayClouds * 1.4;
      } else if (pattern < 2) {
        // Cloudy morning, clear afternoon
        hourClouds = h < 12 ? dayClouds * 1.4 : dayClouds * 0.6;
      } else if (pattern < 3) {
        // Cloudier at dawn and dusk
        hourClouds = (h < 6 || h > 18) ? dayClouds * 1.3 : dayClouds;
      }
      
      hourClouds = Math.max(0, Math.min(100, hourClouds));
      
      // Precipitation (more likely in afternoon if clouds are high)
      let hourPrecip = 0;
      if (hourClouds > 70) {
        // Afternoon rain more likely
        if (h >= 12 && h <= 18) {
          hourPrecip = dayPrecip * (1 + (Math.random() * 0.5));
        } else {
          hourPrecip = dayPrecip * (Math.random() * 0.5);
        }
      }
      
      // Wind tends to pick up in the afternoon
      const hourWind = 5 + (Math.random() * 10) + (h >= 10 && h <= 16 ? 5 : 0);
      
      // Humidity (higher when raining or at night)
      const hourHumidity = hourPrecip > 0 
        ? 70 + Math.random() * 20 
        : (h >= 10 && h <= 17) 
          ? 40 + Math.random() * 30 
          : 60 + Math.random() * 20;
      
      // Add to hourly forecast
      hourly.push({
        site_id: siteId,
        timestamp: hourDate.toISOString(),
        forecast: true,
        temperature: Number(hourTemp.toFixed(1)),
        humidity: Number(hourHumidity.toFixed(1)),
        precipitation: Number(hourPrecip.toFixed(1)),
        wind_speed: Number(hourWind.toFixed(1)),
        wind_direction: Number((Math.random() * 360).toFixed(1)),
        cloud_cover: Number(hourClouds.toFixed(1)),
        source: 'google_weather_api'
      });
    }
    
    // Calculate day summary (min/max/avg)
    const dayHours = hourly.filter(h => h.timestamp.startsWith(dateStr));
    const maxTemp = Math.max(...dayHours.map(h => h.temperature || 0));
    const minTemp = Math.min(...dayHours.map(h => h.temperature || 0));
    const avgTemp = dayHours.reduce((sum, h) => sum + (h.temperature || 0), 0) / dayHours.length;
    const maxPrecip = Math.max(...dayHours.map(h => h.precipitation || 0));
    
    const dayCondition = maxPrecip > 5 
      ? 'Heavy Rain' 
      : maxPrecip > 0 
        ? 'Light Rain' 
        : dayClouds > 80 
          ? 'Cloudy' 
          : dayClouds > 40 
            ? 'Partly Cloudy' 
            : 'Sunny';
    
    daily.push({
      site_id: siteId,
      timestamp: `${dateStr}T12:00:00Z`,
      forecast: true,
      temperature: Number(avgTemp.toFixed(1)),
      precipitation: maxPrecip,
      cloud_cover: dayClouds,
      source: 'google_weather_api',
      conditions: `${dayCondition} (High: ${maxTemp.toFixed(1)}°C, Low: ${minTemp.toFixed(1)}°C)`
    });
  }
  
  return {
    hourly,
    daily
  };
};
