
import { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { EnergyForecast } from '@/types/energy';
import { generateEnergyPredictions } from '@/services/energyAIPredictionService';
import { getWeatherForecast } from '@/services/weatherService';
import { useSite, useSiteContext } from '@/contexts/SiteContext';
import { generateSampleForecasts } from '@/services/forecasts/sampleGenerator';

const REFRESH_INTERVAL = 15000; // 15 seconds

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
  netEnergy?: number; // Add this missing property
}

export interface Prediction {
  date: string;
  generation: number;
  consumption: number;
  temperature?: number;
  cloudCover?: number;
  windSpeed?: number;
  weatherCondition?: string;
  confidence?: number; // Add this missing property
}

export function useForecastData() {
  const { activeSite } = useSiteContext();
  const [isUsingLocalData, setIsUsingLocalData] = useState(false);
  const [processedData, setProcessedData] = useState<ForecastDataPoint[]>([]);
  const [forecastMetrics, setForecastMetrics] = useState<ForecastMetrics>({
    totalGeneration: 0,
    totalConsumption: 0,
    peakGeneration: 0,
    peakConsumption: 0,
    confidence: 85,
    netEnergy: 0 // Add the missing property
  });
  const [currentWeather, setCurrentWeather] = useState<{
    condition: string;
    temperature: number;
    cloudCover: number;
    windSpeed: number;
  } | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  // Fetch energy forecasts
  const {
    data: forecastData,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['energyForecasts', activeSite?.id],
    queryFn: async () => {
      try {
        const data = await generateEnergyPredictions(activeSite?.id || 'default', 1, true);
        setIsUsingLocalData(false);
        return data;
      } catch (err) {
        console.error('Error fetching energy predictions:', err);
        
        // Fallback to sample data
        setIsUsingLocalData(true);
        const sampleData = generateSampleForecasts(activeSite?.id || 'default');
        return sampleData.map(forecast => ({
          date: forecast.forecast_time,
          generation: forecast.generation_forecast,
          consumption: forecast.consumption_forecast,
          temperature: forecast.temperature,
          cloudCover: forecast.cloud_cover,
          windSpeed: forecast.wind_speed,
          weatherCondition: forecast.weather_condition,
          confidence: forecast.confidence || 85, // Add default confidence
        }));
      }
    },
    refetchInterval: REFRESH_INTERVAL,
    refetchOnWindowFocus: false,
  });

  // Fetch weather data
  const { data: weatherData } = useQuery({
    queryKey: ['weatherForecast', activeSite?.id],
    queryFn: async () => {
      try {
        return await getWeatherForecast(activeSite?.id || 'default', 1);
      } catch (err) {
        console.error('Error fetching weather forecast:', err);
        return [];
      }
    },
    refetchInterval: REFRESH_INTERVAL,
    refetchOnWindowFocus: false,
  });

  // Process forecasts data when it changes
  useEffect(() => {
    if (forecastData && forecastData.length > 0) {
      // Transform forecast data into the format needed for charts and metrics
      const transformed: ForecastDataPoint[] = forecastData.map(forecast => {
        const time = new Date(forecast.date);
        return {
          time: time.toISOString(),
          generation: Number(forecast.generation),
          consumption: Number(forecast.consumption),
          netEnergy: Number(forecast.generation) - Number(forecast.consumption),
          weather: {
            condition: forecast.weatherCondition,
            temperature: forecast.temperature,
            cloudCover: forecast.cloudCover,
            windSpeed: forecast.windSpeed,
          },
        };
      });

      // Sort by time
      transformed.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());
      
      // Set processed data for display
      setProcessedData(transformed);
      
      // Calculate metrics
      const totalGeneration = transformed.reduce((sum, item) => sum + item.generation, 0);
      const totalConsumption = transformed.reduce((sum, item) => sum + item.consumption, 0);
      const peakGeneration = Math.max(...transformed.map(item => item.generation));
      const peakConsumption = Math.max(...transformed.map(item => item.consumption));
      const netEnergy = totalGeneration - totalConsumption;
      
      setForecastMetrics({
        totalGeneration: Number(totalGeneration.toFixed(1)),
        totalConsumption: Number(totalConsumption.toFixed(1)),
        peakGeneration: Number(peakGeneration.toFixed(1)),
        peakConsumption: Number(peakConsumption.toFixed(1)),
        confidence: Math.round((forecastData[0]?.confidence || 85)),
        netEnergy: Number(netEnergy.toFixed(1))
      });

      // Set current weather from the first forecast item
      if (transformed[0]?.weather) {
        setCurrentWeather({
          condition: transformed[0].weather.condition || 'Unknown',
          temperature: transformed[0].weather.temperature || 0,
          cloudCover: transformed[0].weather.cloudCover || 0,
          windSpeed: transformed[0].weather.windSpeed || 0,
        });
      }

      setLastUpdated(new Date().toISOString());
    }
  }, [forecastData]);

  // Function to manually refresh the data
  const refreshData = useCallback(() => {
    refetch();
    toast.success('Forecast data refreshed');
  }, [refetch]);

  return {
    processedData,
    forecastMetrics,
    isLoading,
    error,
    refreshData,
    isUsingLocalData,
    currentWeather,
    lastUpdated
  };
}
