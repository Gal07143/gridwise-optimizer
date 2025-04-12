
import { useState, useEffect } from 'react';
import { EnergyForecast, WeatherData } from '@/types/energy';
import { generateMockForecasts } from '@/services/forecasts/sampleGenerator';

export interface ProcessedForecastData {
  timestamp: string;
  production: number;
  consumption: number;
  balance?: number;
  generation?: number; // Alternative name for production
  hour?: string;       // For hour-based display
}

export interface ForecastMetrics {
  totalGeneration: number;
  totalConsumption: number;
  netEnergy: number;
  selfConsumptionRate: number;
  confidence: number;
  peakGeneration: number;
  peakConsumption: number;
}

export function useForecast(siteId: string = 'default') {
  const [processedData, setProcessedData] = useState<ProcessedForecastData[]>([]);
  const [forecastMetrics, setForecastMetrics] = useState<ForecastMetrics>({
    totalGeneration: 0,
    totalConsumption: 0,
    netEnergy: 0,
    selfConsumptionRate: 0,
    confidence: 85,
    peakGeneration: 0,
    peakConsumption: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isUsingLocalData, setIsUsingLocalData] = useState(true);
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const refreshData = async () => {
    setIsLoading(true);
    try {
      // In a real app, this would be an API call
      const mockData = generateMockForecasts(siteId, 24);
      
      // Process the data
      const processed = mockData.map(item => ({
        timestamp: item.timestamp,
        hour: new Date(item.timestamp).getHours().toString().padStart(2, '0') + ':00',
        production: item.generation_forecast || 0,
        consumption: item.consumption_forecast || 0,
        generation: item.generation_forecast || 0, // Alternative name
        balance: (item.generation_forecast || 0) - (item.consumption_forecast || 0)
      }));
      
      setProcessedData(processed);
      
      // Calculate metrics
      const totalGen = processed.reduce((sum, item) => sum + item.production, 0);
      const totalCons = processed.reduce((sum, item) => sum + item.consumption, 0);
      const peakGen = Math.max(...processed.map(item => item.production));
      const peakCons = Math.max(...processed.map(item => item.consumption));
      
      // Calculate self-consumption rate (capped at 100%)
      let selfConsumptionRate = totalGen > 0 ? Math.min(100, (Math.min(totalGen, totalCons) / totalGen) * 100) : 0;
      
      setForecastMetrics({
        totalGeneration: totalGen,
        totalConsumption: totalCons,
        netEnergy: totalGen - totalCons,
        selfConsumptionRate: selfConsumptionRate,
        confidence: 85 + Math.random() * 10,
        peakGeneration: peakGen,
        peakConsumption: peakCons
      });
      
      // Set current weather from the first forecast item
      if (mockData[0]) {
        setCurrentWeather({
          condition: mockData[0].weather_condition || 'Clear',
          temperature: mockData[0].temperature || 20,
          humidity: 50,
          wind_speed: mockData[0].wind_speed || 5,
          cloud_cover: mockData[0].cloud_cover || 10,
          precipitation: 0,
          timestamp: mockData[0].timestamp
        });
      }
      
      setLastUpdated(new Date().toISOString());
      setError(null);
    } catch (err) {
      console.error('Error fetching forecast data:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch forecast data'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, [siteId]);

  return {
    processedData,
    forecastMetrics,
    isLoading,
    error,
    isUsingLocalData,
    currentWeather,
    lastUpdated,
    refreshData
  };
}
