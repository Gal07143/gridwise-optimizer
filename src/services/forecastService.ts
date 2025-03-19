
import { supabase } from "@/integrations/supabase/client";
import { EnergyForecast, Site } from "@/types/energy";
import { toast } from "sonner";

/**
 * Get energy forecasts for a site
 */
export const getSiteForecasts = async (siteId: string, hours = 24): Promise<EnergyForecast[]> => {
  try {
    // Query the energy_forecasts table with safe casting
    const { data, error } = await supabase
      .from('energy_forecasts')
      .select('*')
      .eq('site_id', siteId)
      .order('forecast_time', { ascending: true })
      .limit(hours);
    
    if (error) throw error;
    
    // Cast data to the correct type
    return (data || []) as EnergyForecast[];
    
  } catch (error) {
    console.error(`Error fetching forecasts for site ${siteId}:`, error);
    toast.error("Failed to fetch energy forecasts");
    return [];
  }
};

/**
 * Get aggregated forecast metrics for a site
 */
export const getSiteForecastMetrics = async (siteId: string) => {
  try {
    const forecasts = await getSiteForecasts(siteId);
    
    if (forecasts.length === 0) {
      return {
        totalGeneration: 0,
        totalConsumption: 0,
        netEnergy: 0,
        peakGeneration: 0,
        peakConsumption: 0,
        confidence: 0,
      };
    }
    
    const totalGeneration = forecasts.reduce((sum, item) => sum + item.generation_forecast, 0);
    const totalConsumption = forecasts.reduce((sum, item) => sum + item.consumption_forecast, 0);
    const netEnergy = totalGeneration - totalConsumption;
    const peakGeneration = Math.max(...forecasts.map(item => item.generation_forecast));
    const peakConsumption = Math.max(...forecasts.map(item => item.consumption_forecast));
    const avgConfidence = forecasts.reduce((sum, item) => sum + (item.confidence || 0), 0) / forecasts.length;
    
    return {
      totalGeneration,
      totalConsumption,
      netEnergy,
      peakGeneration,
      peakConsumption,
      confidence: avgConfidence,
    };
  } catch (error) {
    console.error(`Error calculating forecast metrics for site ${siteId}:`, error);
    return null;
  }
};

/**
 * Insert energy forecasts for a site
 * Note: Only users with proper permissions can insert forecasts
 */
export const insertEnergyForecasts = async (forecasts: Omit<EnergyForecast, 'id' | 'created_at' | 'timestamp'>[]): Promise<boolean> => {
  try {
    // Add timestamp field to each forecast
    const forecastsWithTimestamp = forecasts.map(forecast => ({
      ...forecast,
      timestamp: new Date().toISOString()
    }));
    
    const { error } = await supabase
      .from('energy_forecasts')
      .insert(forecastsWithTimestamp);
    
    if (error) {
      // If there's a row-level security policy error, we'll handle it gracefully
      if (error.code === '42501') {
        console.warn('Permission denied: Unable to insert energy forecasts due to security policy');
        toast.warning("Using local forecast data (no database write permission)");
        return true; // Return true to allow the app to continue with mock data
      }
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error inserting energy forecasts:', error);
    toast.error("Failed to insert energy forecasts");
    return false;
  }
};

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
