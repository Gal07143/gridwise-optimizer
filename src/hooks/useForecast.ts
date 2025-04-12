
import { useState, useEffect } from 'react';
import { EnergyForecast } from '@/types/energy-forecast';
import { WeatherForecast } from '@/types/forecast';
import { getEnergyForecasts, getWeatherForecast } from '@/services/forecasts/forecastService';

export type ForecastDataPoint = {
  timestamp: string;
  value: number;
  forecasted: boolean;
};

export interface ForecastMetrics {
  totalGeneration: number;
  totalConsumption: number;
  netEnergy: number;
  selfConsumptionRate: number;
  confidence: number;
  peakGeneration: number;
  peakConsumption: number;
}

export const useForecast = () => {
  const [energyForecast, setEnergyForecast] = useState<EnergyForecast[]>([]);
  const [weatherForecast, setWeatherForecast] = useState<WeatherForecast[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [forecastType, setForecastType] = useState<'energy' | 'weather'>('energy');
  const [processedData, setProcessedData] = useState<any[]>([]);
  const [forecastMetrics, setForecastMetrics] = useState<ForecastMetrics>({
    totalGeneration: 0,
    totalConsumption: 0,
    netEnergy: 0,
    selfConsumptionRate: 0,
    confidence: 85,
    peakGeneration: 0,
    peakConsumption: 0
  });
  const [isUsingLocalData, setIsUsingLocalData] = useState<boolean>(true);
  const [currentWeather, setCurrentWeather] = useState<{condition: string, temperature: number} | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  // Transform the forecast data for display
  const transformedForecast = energyForecast.map(forecast => ({
    timestamp: forecast.timestamp,
    production: forecast.generation_forecast || forecast.forecasted_production,
    consumption: forecast.consumption_forecast || forecast.forecasted_consumption,
    balance: (forecast.generation_forecast || forecast.forecasted_production || 0) - 
             (forecast.consumption_forecast || forecast.forecasted_consumption || 0)
  }));

  const refreshData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [energyData, weatherData] = await Promise.all([
        getEnergyForecasts(),
        getWeatherForecast()
      ]);
      
      setEnergyForecast(energyData);
      setWeatherForecast(weatherData);
      setLastUpdated(new Date().toISOString());
      setIsUsingLocalData(true); // We're using mock data for now
      
      if (weatherData.length > 0) {
        const current = weatherData[0];
        setCurrentWeather({
          condition: current.weather_condition || 'Clear',
          temperature: current.temperature || 20
        });
      }
      
      // Calculate metrics
      const totalGen = energyData.reduce((sum, item) => 
        sum + (item.generation_forecast || item.forecasted_production || 0), 0);
      
      const totalCons = energyData.reduce((sum, item) => 
        sum + (item.consumption_forecast || item.forecasted_consumption || 0), 0);
      
      const peakGen = Math.max(...energyData.map(item => 
        item.generation_forecast || item.forecasted_production || 0));
      
      const peakCons = Math.max(...energyData.map(item => 
        item.consumption_forecast || item.forecasted_consumption || 0));
      
      const netEnergy = totalGen - totalCons;
      const selfConsumptionRate = totalGen > 0 ? 
        (Math.min(totalGen, totalCons) / totalGen) * 100 : 0;
      
      setForecastMetrics({
        totalGeneration: parseFloat(totalGen.toFixed(2)),
        totalConsumption: parseFloat(totalCons.toFixed(2)),
        netEnergy: parseFloat(netEnergy.toFixed(2)),
        selfConsumptionRate: parseFloat(selfConsumptionRate.toFixed(1)),
        confidence: 85,
        peakGeneration: parseFloat(peakGen.toFixed(2)),
        peakConsumption: parseFloat(peakCons.toFixed(2))
      });
      
      // Process data for charts
      setProcessedData(transformedForecast);
      
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch forecast data'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
    // Set up refresh interval - every 30 minutes
    const intervalId = setInterval(refreshData, 30 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, []);

  return {
    weatherForecast,
    energyForecast,
    transformedForecast,
    isLoading,
    error,
    forecastType,
    setForecastType,
    processedData,
    forecastMetrics,
    isUsingLocalData,
    currentWeather,
    lastUpdated,
    refreshData
  };
};

export default useForecast;
