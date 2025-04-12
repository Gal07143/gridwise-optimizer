
import { useState, useEffect } from 'react';
import { fetchForecasts } from '@/services/forecasts/forecastService';
import { ProcessedForecastData, ForecastMetrics } from '@/types/energy';

export const useForecast = (timeframe: string = '24h', siteId?: string) => {
  const [processedData, setProcessedData] = useState<ProcessedForecastData[]>([]);
  const [metrics, setMetrics] = useState<ForecastMetrics>({
    totalGeneration: 0,
    totalConsumption: 0,
    netEnergy: 0,
    peakGeneration: 0,
    peakConsumption: 0,
    selfConsumptionRate: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Process the forecast data for visualization
  const processForecasts = (data: any[]): ProcessedForecastData[] => {
    if (!data || !Array.isArray(data)) return [];
    
    return data.map(item => ({
      timestamp: new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      production: item.generation_forecast || 0,
      consumption: item.consumption_forecast || 0,
      balance: (item.generation_forecast || 0) - (item.consumption_forecast || 0)
    }));
  };

  // Calculate metrics from forecast data
  const calculateMetrics = (data: any[]): ForecastMetrics => {
    if (!data || !data.length) {
      return {
        totalGeneration: 0,
        totalConsumption: 0,
        netEnergy: 0,
        peakGeneration: 0,
        peakConsumption: 0,
        selfConsumptionRate: 0
      };
    }

    const totalGeneration = data.reduce((sum, item) => sum + (item.generation_forecast || 0), 0);
    const totalConsumption = data.reduce((sum, item) => sum + (item.consumption_forecast || 0), 0);
    const peakGeneration = Math.max(...data.map(item => item.generation_forecast || 0));
    const peakConsumption = Math.max(...data.map(item => item.consumption_forecast || 0));
    
    // Calculate self-consumption rate (percentage of generated energy directly consumed)
    const selfConsumption = data.reduce((sum, item) => {
      const gen = item.generation_forecast || 0;
      const con = item.consumption_forecast || 0;
      return sum + Math.min(gen, con);
    }, 0);
    
    const selfConsumptionRate = totalGeneration > 0 ? (selfConsumption / totalGeneration) * 100 : 0;

    return {
      totalGeneration,
      totalConsumption,
      netEnergy: totalGeneration - totalConsumption,
      peakGeneration,
      peakConsumption,
      selfConsumptionRate
    };
  };

  // Fetch and process the forecast data
  const fetchAndProcessForecasts = async () => {
    try {
      setLoading(true);
      const data = await fetchForecasts(timeframe, siteId);
      const processed = processForecasts(data);
      const calculatedMetrics = calculateMetrics(data);
      
      setProcessedData(processed);
      setMetrics(calculatedMetrics);
      setError(null);
    } catch (err) {
      console.error('Error fetching forecasts:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch forecasts'));
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch and periodic refresh
  useEffect(() => {
    fetchAndProcessForecasts();
    
    const interval = setInterval(fetchAndProcessForecasts, 5 * 60 * 1000); // Refresh every 5 minutes
    
    return () => {
      clearInterval(interval);
    };
  }, [timeframe, siteId]);

  // Manually trigger a refresh
  const refresh = () => {
    fetchAndProcessForecasts();
  };

  return { data: processedData, metrics, loading, error, refresh };
};

export default useForecast;
