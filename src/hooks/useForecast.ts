
import { useState, useEffect } from 'react';
import { WeatherData } from '@/types/weather';
import axios from 'axios';

export interface ForecastMetrics {
  totalGeneration: number;
  totalConsumption: number;
  netEnergy: number;
  selfConsumptionRate: number;
  confidence: number;
  peakGeneration: number;
  peakConsumption: number;
}

export interface ForecastSettings {
  hours: number;
  includeBattery: boolean;
  includeEV: boolean;
}

interface ProcessedForecastData {
  time: string;
  solarGeneration: number;
  homeConsumption: number;
  batteryFlow: number;
  gridFlow: number;
}

export function useForecast(siteId?: string, settings?: Partial<ForecastSettings>) {
  const [processedData, setProcessedData] = useState<ProcessedForecastData[]>([]);
  const [forecastMetrics, setForecastMetrics] = useState<ForecastMetrics>({
    totalGeneration: 36.5,
    totalConsumption: 42.8,
    netEnergy: -6.3,
    selfConsumptionRate: 78,
    confidence: 85,
    peakGeneration: 8.2,
    peakConsumption: 6.5
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);
  const [isUsingLocalData, setIsUsingLocalData] = useState<boolean>(true);
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(new Date().toISOString());

  useEffect(() => {
    const fetchForecastData = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would call your backend API
        // For now, we'll generate some sample data
        const data = generateSampleForecastData();
        setProcessedData(data);
        
        // Fetch current weather
        try {
          const weatherResponse = await axios.get('/api/weather');
          setCurrentWeather(weatherResponse.data);
          setIsUsingLocalData(false);
        } catch (weatherError) {
          console.log('Using sample weather data', weatherError);
          setCurrentWeather({
            condition: 'partly-cloudy',
            temperature: 22,
            humidity: 65,
            wind_speed: 12,
            cloud_cover: 40,
            precipitation: 0,
            timestamp: new Date().toISOString()
          });
          setIsUsingLocalData(true);
        }
        
        setLastUpdated(new Date().toISOString());
      } catch (err) {
        console.error('Error fetching forecast data:', err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchForecastData();
  }, [siteId]);

  const refreshData = () => {
    const data = generateSampleForecastData();
    setProcessedData(data);
    setLastUpdated(new Date().toISOString());
    return Promise.resolve(forecastMetrics);
  };

  return {
    processedData,
    forecastMetrics,
    isLoading,
    error,
    isUsingLocalData,
    currentWeather,
    lastUpdated,
    refreshData,
    metrics: forecastMetrics,
    refetch: refreshData
  };
}

function generateSampleForecastData(): ProcessedForecastData[] {
  const data: ProcessedForecastData[] = [];
  const now = new Date();
  
  for (let i = 0; i < 24; i++) {
    const hour = new Date(now.getTime() + i * 60 * 60 * 1000);
    const hourString = hour.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // Solar production peaks during midday
    const timeOfDay = hour.getHours();
    let solarGeneration = 0;
    
    if (timeOfDay >= 6 && timeOfDay <= 18) {
      // Bell curve for solar production with peak at noon
      const distanceFromNoon = Math.abs(12 - timeOfDay);
      solarGeneration = Math.max(0, 7.5 - distanceFromNoon * 1.2) * (0.8 + Math.random() * 0.4);
    }
    
    // Consumption has morning and evening peaks
    let consumption = 2.0; // Base load
    if (timeOfDay >= 6 && timeOfDay <= 9) {
      // Morning peak
      consumption += 2.5 * (0.8 + Math.random() * 0.4);
    } else if (timeOfDay >= 17 && timeOfDay <= 22) {
      // Evening peak
      consumption += 3.0 * (0.8 + Math.random() * 0.4);
    } else {
      // Regular hours
      consumption += 1.0 * (0.8 + Math.random() * 0.4);
    }
    
    // Battery charges when surplus solar, discharges during evening
    let batteryFlow = 0;
    if (solarGeneration > consumption) {
      batteryFlow = Math.min(2.0, (solarGeneration - consumption) * 0.8); // Charging (positive)
    } else if (timeOfDay >= 18 && timeOfDay <= 22) {
      batteryFlow = -Math.min(2.5, Math.random() * 1.5); // Discharging (negative)
    }
    
    // Grid flow: positive = import, negative = export
    const gridFlow = consumption - solarGeneration - batteryFlow;
    
    data.push({
      time: hourString,
      solarGeneration: parseFloat(solarGeneration.toFixed(1)),
      homeConsumption: parseFloat(consumption.toFixed(1)),
      batteryFlow: parseFloat(batteryFlow.toFixed(1)),
      gridFlow: parseFloat(gridFlow.toFixed(1))
    });
  }
  
  return data;
}
