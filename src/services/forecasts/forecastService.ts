
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { generateSampleForecasts } from "./sampleGenerator";

export interface ForecastDataPoint {
  time: string;
  generation: number;
  consumption: number;
  netEnergy: number;
  weather?: {
    condition?: string;
    temperature?: number;
    cloudCover?: number;
    windSpeed?: number;
  };
}

export interface ForecastMetrics {
  totalGeneration: number;
  totalConsumption: number;
  peakGeneration: number;
  peakConsumption: number;
  confidence: number;
  netEnergy: number;
}

export interface WeatherCondition {
  condition: string;
  temperature: number;
  cloudCover: number;
  windSpeed: number;
}

/**
 * Get energy forecast data for a site
 */
export const getEnergyForecast = async (siteId: string): Promise<{
  forecastData: ForecastDataPoint[];
  metrics: ForecastMetrics;
  weather: WeatherCondition | null;
  isLocalData: boolean;
}> => {
  try {
    console.log(`Fetching energy forecast for site: ${siteId}`);
    
    // Call the Supabase Edge Function
    const { data, error } = await supabase.functions.invoke("energy-ai-predictions", {
      body: { siteId, days: 1, includeWeather: true },
    });
    
    if (error) {
      console.error("Error fetching energy forecast:", error);
      throw error;
    }
    
    if (!data?.predictions || data.predictions.length === 0) {
      throw new Error("No forecast data available");
    }
    
    // Transform the data to the required format
    const forecastData: ForecastDataPoint[] = data.predictions.map((prediction: any) => {
      const time = new Date(prediction.date);
      return {
        time: time.toISOString(),
        generation: Number(prediction.generation),
        consumption: Number(prediction.consumption),
        netEnergy: Number(prediction.generation) - Number(prediction.consumption),
        weather: {
          condition: prediction.weatherCondition,
          temperature: prediction.temperature,
          cloudCover: prediction.cloudCover,
          windSpeed: prediction.windSpeed,
        },
      };
    });
    
    // Sort by time
    forecastData.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());
    
    // Calculate metrics
    const totalGeneration = forecastData.reduce((sum, item) => sum + item.generation, 0);
    const totalConsumption = forecastData.reduce((sum, item) => sum + item.consumption, 0);
    const peakGeneration = Math.max(...forecastData.map(item => item.generation));
    const peakConsumption = Math.max(...forecastData.map(item => item.consumption));
    const netEnergy = totalGeneration - totalConsumption;
    
    // Get confidence from the first prediction
    const confidence = typeof data.predictions[0]?.confidence === 'number' 
      ? data.predictions[0].confidence 
      : 85;
    
    // Get current weather from the first forecast point
    let weather: WeatherCondition | null = null;
    
    if (forecastData[0]?.weather) {
      weather = {
        condition: forecastData[0].weather.condition || 'Sunny', // Default value to ensure it's not undefined
        temperature: forecastData[0].weather.temperature ?? 0,
        cloudCover: forecastData[0].weather.cloudCover ?? 0,
        windSpeed: forecastData[0].weather.windSpeed ?? 0,
      };
    }
    
    return {
      forecastData,
      metrics: {
        totalGeneration: Number(totalGeneration.toFixed(1)),
        totalConsumption: Number(totalConsumption.toFixed(1)),
        peakGeneration: Number(peakGeneration.toFixed(1)),
        peakConsumption: Number(peakConsumption.toFixed(1)),
        confidence: Math.round(confidence),
        netEnergy: Number(netEnergy.toFixed(1))
      },
      weather,
      isLocalData: false
    };
  } catch (error) {
    console.error("Error in energy forecast service:", error);
    
    // Fallback to sample data
    console.log("Falling back to sample forecast data");
    const sampleData = generateSampleForecasts(siteId);
    
    // Map the sample data to the same format
    const forecastData: ForecastDataPoint[] = sampleData.map(forecast => {
      const time = new Date(forecast.forecast_time);
      return {
        time: time.toISOString(),
        generation: forecast.generation_forecast,
        consumption: forecast.consumption_forecast,
        netEnergy: forecast.generation_forecast - forecast.consumption_forecast,
        weather: {
          condition: forecast.weather_condition || 'Sunny',
          temperature: forecast.temperature || 22,
          cloudCover: forecast.cloud_cover || 10,
          windSpeed: forecast.wind_speed || 5,
        },
      };
    });
    
    // Calculate metrics from sample data
    const totalGeneration = forecastData.reduce((sum, item) => sum + item.generation, 0);
    const totalConsumption = forecastData.reduce((sum, item) => sum + item.consumption, 0);
    const peakGeneration = Math.max(...forecastData.map(item => item.generation));
    const peakConsumption = Math.max(...forecastData.map(item => item.consumption));
    const netEnergy = totalGeneration - totalConsumption;
    
    // Create a valid WeatherCondition object
    const weather: WeatherCondition = {
      condition: forecastData[0]?.weather?.condition || 'Sunny',
      temperature: forecastData[0]?.weather?.temperature || 22,
      cloudCover: forecastData[0]?.weather?.cloudCover || 10, 
      windSpeed: forecastData[0]?.weather?.windSpeed || 5
    };
    
    return {
      forecastData,
      metrics: {
        totalGeneration: Number(totalGeneration.toFixed(1)),
        totalConsumption: Number(totalConsumption.toFixed(1)),
        peakGeneration: Number(peakGeneration.toFixed(1)),
        peakConsumption: Number(peakConsumption.toFixed(1)),
        confidence: 85, // Default confidence for sample data
        netEnergy: Number(netEnergy.toFixed(1))
      },
      weather,
      isLocalData: true
    };
  }
};

/**
 * Get weather forecast for a site
 */
export const getWeatherForecast = async (siteId: string): Promise<WeatherCondition | null> => {
  try {
    const { data, error } = await supabase.functions.invoke("weather-api", {
      body: { siteId, days: 1 },
    });

    if (error) throw error;
    
    if (!data?.forecast || data.forecast.length === 0) {
      return null;
    }
    
    const currentWeather = data.forecast[0];
    return {
      condition: currentWeather.condition || 'Unknown',
      temperature: currentWeather.temperature || 0,
      cloudCover: currentWeather.cloud_cover || 0,
      windSpeed: currentWeather.wind_speed || 0,
    };
  } catch (error) {
    console.error("Error fetching weather forecast:", error);
    return null;
  }
};
