import { useState, useEffect } from 'react';
import { ProcessedForecastData, ForecastMetrics } from '@/types/energy';

export const useForecast = (siteId: string) => {
  const [forecastData, setForecastData] = useState<ProcessedForecastData[]>([]);
  const [metrics, setMetrics] = useState<ForecastMetrics>({
    totalConsumption: 0,
    totalGeneration: 0,
    peakLoad: 0,
    minLoad: 0,
    averageProduction: 0,
    selfConsumptionRate: 0,
    gridDependenceRate: 0,
    netEnergy: 0
  });

  useEffect(() => {
    // Mock data generation for demonstration
    const generateMockData = () => {
      const now = new Date();
      const data: ProcessedForecastData[] = [];

      let totalConsumption = 0;
      let totalGeneration = 0;
      let peakLoad = 0;
      let minLoad = Infinity;
      let averageProductionSum = 0;

      for (let i = 0; i < 24; i++) {
        const timestamp = new Date(now.getTime() + i * 60 * 60 * 1000).toISOString();
        const production = Math.random() * 5;
        const consumption = Math.random() * 10;
        const balance = production - consumption;

        totalConsumption += consumption;
        totalGeneration += production;
        peakLoad = Math.max(peakLoad, consumption);
        minLoad = Math.min(minLoad, consumption);
        averageProductionSum += production;

        data.push({ timestamp, production, consumption, balance });
      }

      const averageProduction = averageProductionSum / 24;
      const selfConsumptionRate = totalGeneration > 0 ? Math.min(1, totalConsumption / totalGeneration) : 0;
      const gridDependenceRate = totalConsumption > 0 ? Math.min(1, totalConsumption / (totalConsumption + totalGeneration)) : 0;

      setForecastData(data);
      setMetrics({
        totalConsumption,
        totalGeneration,
        peakLoad,
        minLoad,
        averageProduction,
        selfConsumptionRate,
        gridDependenceRate,
        netEnergy: totalGeneration - totalConsumption
      });
    };

    generateMockData();
  }, [siteId]);

  return {
    forecastData,
    metrics
  };
};
