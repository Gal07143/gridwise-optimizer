
import { EnergyForecast } from "@/types/energy";

/**
 * Generate sample forecasts for the next 24 hours (for demo/testing)
 */
export const generateSampleForecasts = (siteId: string): Omit<EnergyForecast, 'id' | 'created_at' | 'timestamp'>[] => {
  const forecasts: Omit<EnergyForecast, 'id' | 'created_at' | 'timestamp'>[] = [];
  const now = new Date();
  
  // Weather conditions to cycle through
  const conditions = ['clear', 'partlyCloudy', 'cloudy', 'rainy', 'sunny'];
  
  for (let i = 0; i < 24; i++) {
    const forecastTime = new Date(now.getTime() + i * 60 * 60 * 1000); // Add hours
    
    // Generate more realistic patterns
    // More generation during daylight hours (6am-6pm)
    const hour = forecastTime.getHours();
    const isDaylight = hour >= 6 && hour <= 18;
    
    // Base values
    let genBase = isDaylight ? 50 + Math.random() * 70 : 5 + Math.random() * 15;
    
    // Peak at midday
    if (hour >= 10 && hour <= 14) {
      genBase += 40 + Math.random() * 30;
    }
    
    // Consumption peaks in morning and evening
    let consBase = 30 + Math.random() * 20;
    if (hour >= 6 && hour <= 9) {
      consBase += 30 + Math.random() * 20; // Morning peak
    } else if (hour >= 17 && hour <= 22) {
      consBase += 40 + Math.random() * 30; // Evening peak
    }
    
    // Weather impact
    const weatherIndex = Math.floor(Math.random() * conditions.length);
    const weather = conditions[weatherIndex];
    const temperature = isDaylight 
      ? 18 + Math.random() * 10 
      : 10 + Math.random() * 8;
    
    const cloudCover = weather === 'clear' || weather === 'sunny' 
      ? Math.random() * 20 
      : 40 + Math.random() * 60;
    
    // Reduce generation based on cloud cover
    if (cloudCover > 40 && isDaylight) {
      genBase = genBase * (1 - (cloudCover - 40) / 100);
    }
    
    const windSpeed = 3 + Math.random() * 12;
    
    forecasts.push({
      site_id: siteId,
      forecast_time: forecastTime.toISOString(),
      generation_forecast: Math.round(genBase * 10) / 10,
      consumption_forecast: Math.round(consBase * 10) / 10,
      weather_condition: weather,
      temperature: Math.round(temperature * 10) / 10,
      cloud_cover: Math.round(cloudCover),
      wind_speed: Math.round(windSpeed * 10) / 10,
      confidence: 70 + Math.random() * 25,
      source: 'model'
    });
  }
  
  return forecasts;
};
