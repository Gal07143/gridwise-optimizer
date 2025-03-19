
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { useSite } from '@/contexts/SiteContext';
import { 
  getSiteForecasts, 
  getSiteForecastMetrics, 
  generateSampleForecasts, 
  insertEnergyForecasts 
} from '@/services/forecasts';
import { EnergyForecast } from '@/types/energy';

export interface ForecastDataPoint {
  hour: string;
  generation: number;
  consumption: number;
  net: number;
  weather?: string;
  temp?: number;
  windSpeed?: number;
}

export interface ForecastMetrics {
  totalGeneration: number;
  totalConsumption: number;
  netEnergy: number;
  peakGeneration: number;
  peakConsumption: number;
  confidence: number;
}

export const useForecastData = () => {
  const { currentSite } = useSite();
  const [hasForecastData, setHasForecastData] = useState(false);
  const [localForecasts, setLocalForecasts] = useState<EnergyForecast[]>([]);
  const [isUsingLocalData, setIsUsingLocalData] = useState(false);
  
  // Fetch forecasts for the selected site
  const { 
    data: forecasts, 
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['forecasts', currentSite?.id],
    queryFn: async () => {
      if (!currentSite?.id) return [];
      const data = await getSiteForecasts(currentSite.id);
      setHasForecastData(data.length > 0);
      return data;
    },
    enabled: !!currentSite?.id,
  });

  // Fetch metrics for the selected site
  const { 
    data: metrics,
    isLoading: isLoadingMetrics
  } = useQuery({
    queryKey: ['forecast-metrics', currentSite?.id],
    queryFn: async () => {
      if (!currentSite?.id) return null;
      return await getSiteForecastMetrics(currentSite.id);
    },
    enabled: !!currentSite?.id,
  });

  // Generate sample forecasts if needed
  useEffect(() => {
    const checkAndGenerateSampleData = async () => {
      if (!currentSite?.id || isLoading) return;
      
      // If we have data from the database, use that
      if (Array.isArray(forecasts) && forecasts.length > 0) {
        setLocalForecasts(forecasts);
        setIsUsingLocalData(false);
        return;
      }
      
      // If we don't have data, generate sample data
      if (Array.isArray(forecasts) && forecasts.length === 0) {
        toast.info('Generating sample forecast data for demonstration');
        const sampleForecasts = generateSampleForecasts(currentSite.id);
        
        // First try to insert into database
        const { success, localMode } = await insertEnergyForecasts(sampleForecasts);
        
        if (success && !localMode) {
          // If successful database insertion, refetch to get the data with IDs
          refetch();
        } else {
          // If database insertion failed or we're in local mode, use the sample data locally
          const nowTimestamp = new Date().toISOString();
          const localData = sampleForecasts.map((forecast, index) => ({
            ...forecast,
            id: `local-${index}`,
            created_at: nowTimestamp,
            timestamp: nowTimestamp
          })) as EnergyForecast[];
          
          setLocalForecasts(localData);
          setIsUsingLocalData(true);
        }
      }
    };

    checkAndGenerateSampleData();
  }, [currentSite?.id, forecasts, isLoading, refetch]);

  // Get the effective forecasts (either from DB or local)
  const effectiveForecasts = (forecasts && forecasts.length > 0) ? forecasts : localForecasts;
  
  // Process forecast data for the chart
  const processedData: ForecastDataPoint[] = effectiveForecasts.length > 0
    ? effectiveForecasts.map(forecast => ({
        hour: format(new Date(forecast.forecast_time), 'HH:00'),
        generation: forecast.generation_forecast,
        consumption: forecast.consumption_forecast,
        net: forecast.generation_forecast - forecast.consumption_forecast,
        weather: forecast.weather_condition,
        temp: forecast.temperature,
        windSpeed: forecast.wind_speed
      }))
    : [];
  
  // Calculate metrics or use the ones from the query
  const forecastMetrics: ForecastMetrics = metrics || {
    totalGeneration: effectiveForecasts.reduce((sum, item) => sum + item.generation_forecast, 0),
    totalConsumption: effectiveForecasts.reduce((sum, item) => sum + item.consumption_forecast, 0),
    netEnergy: effectiveForecasts.reduce((sum, item) => sum + item.generation_forecast - item.consumption_forecast, 0),
    peakGeneration: Math.max(...effectiveForecasts.map(item => item.generation_forecast || 0), 0),
    peakConsumption: Math.max(...effectiveForecasts.map(item => item.consumption_forecast || 0), 0),
    confidence: effectiveForecasts.reduce((sum, item) => sum + (item.confidence || 0), 0) / 
              (effectiveForecasts.length || 1)
  };

  return {
    processedData,
    forecastMetrics,
    isLoading,
    isLoadingMetrics,
    error,
    isUsingLocalData,
    hasForecastData
  };
};

export default useForecastData;
