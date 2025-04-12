
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

export function useForecast(siteId: string, settings?: Partial<ForecastSettings>) {
  // This would be implemented to provide forecast functionality
  const defaultMetrics: ForecastMetrics = {
    totalGeneration: 36.5,
    totalConsumption: 42.8,
    netEnergy: -6.3,
    selfConsumptionRate: 78,
    confidence: 85,
    peakGeneration: 8.2,
    peakConsumption: 6.5
  };

  return {
    metrics: defaultMetrics,
    isLoading: false,
    error: null,
    refetch: () => Promise.resolve(defaultMetrics)
  };
}
