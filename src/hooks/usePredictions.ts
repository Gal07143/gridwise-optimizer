
import { useState, useEffect } from 'react';

// Define the correct types for our prediction data
export interface PredictionDataPoint {
  day: string;
  value: number;
  confidence: number;
}

export interface SystemRecommendation {
  id: string;
  title: string;
  description: string;
  type: string;
  priority: 'high' | 'medium' | 'low';
  potential_savings: number;
  implementation_effort: string;
  confidence: number;
  created_at: string;
  applied?: boolean;
}

// Mock function to generate prediction data
export const generatePredictionData = (
  timeframe: 'day' | 'week' | 'month' | 'year' = 'week',
  days: number = 7
): PredictionDataPoint[] => {
  const data: PredictionDataPoint[] = [];
  const now = new Date();
  
  for (let i = 0; i < days; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() + i);
    
    // Generate a value based on the timeframe
    let value: number;
    switch (timeframe) {
      case 'day':
        value = 10 + Math.random() * 5;
        break;
      case 'week':
        value = 15 + Math.random() * 10;
        break;
      case 'month':
        value = 25 + Math.random() * 15;
        break;
      case 'year':
        value = 40 + Math.random() * 20;
        break;
      default:
        value = 20 + Math.random() * 10;
    }
    
    data.push({
      day: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
      value: parseFloat(value.toFixed(1)),
      confidence: 0.7 + Math.random() * 0.25
    });
  }
  
  return data;
};

// Mock function to get system recommendations
export const getSystemRecommendations = (): SystemRecommendation[] => {
  return [
    {
      id: '1',
      title: 'Optimize battery charging schedule',
      description: 'Adjusting the battery charging schedule to off-peak hours could reduce electricity costs.',
      type: 'cost_optimization',
      priority: 'high',
      potential_savings: 120.5,
      implementation_effort: 'low',
      confidence: 0.85,
      created_at: new Date().toISOString(),
      applied: false
    },
    {
      id: '2',
      title: 'Reduce HVAC load during peak hours',
      description: 'Reducing HVAC usage during peak demand hours could save significant energy costs.',
      type: 'energy_efficiency',
      priority: 'medium',
      potential_savings: 75.8,
      implementation_effort: 'medium',
      confidence: 0.72,
      created_at: new Date().toISOString(),
      applied: false
    },
    {
      id: '3',
      title: 'Install additional solar panels',
      description: 'Based on your energy usage patterns, installing 4 more solar panels would optimize cost savings.',
      type: 'system_expansion',
      priority: 'low',
      potential_savings: 210.3,
      implementation_effort: 'high',
      confidence: 0.68,
      created_at: new Date().toISOString(),
      applied: false
    }
  ];
};

// Mock function to apply a recommendation
export const applyRecommendation = (recommendationId: string): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`Applied recommendation ${recommendationId}`);
      resolve(true);
    }, 1000);
  });
};

// Mock function to get model status
export const getModelStatus = () => {
  return {
    status: 'active',
    lastTraining: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    accuracy: 0.87,
    version: '1.2.3',
    dataPoints: 4523
  };
};

// Mock function to train the model
export const trainModel = async (): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(true), 2000);
  });
};

export interface UsePredictionsResult {
  predictions: PredictionDataPoint[];
  isLoading: boolean;
  error: Error | null;
  recommendations: SystemRecommendation[];
  predictionDays: number;
  setPredictionDays: (days: number) => void;
  refreshData: () => void;
  modelVersion?: string;
  refetch: () => void;
}

const usePredictions = (
  timeframe: 'day' | 'week' | 'month' | 'year' = 'week', 
  customData?: PredictionDataPoint[]
): UsePredictionsResult => {
  const [predictions, setPredictions] = useState<PredictionDataPoint[]>([]);
  const [recommendations, setRecommendations] = useState<SystemRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [predictionDays, setPredictionDays] = useState<number>(7);
  const [modelVersion, setModelVersion] = useState<string>("1.2.3");

  const fetchData = async () => {
    try {
      setIsLoading(true);
      // Generate prediction data based on timeframe
      const data = customData || generatePredictionData(timeframe, predictionDays);
      setPredictions(data);

      // Get recommendations
      const recs = getSystemRecommendations();
      setRecommendations(recs);
      
      setError(null);
    } catch (err) {
      console.error('Error fetching prediction data:', err);
      setError(err instanceof Error ? err : new Error('Unknown error'));
      setPredictions([]);
      setRecommendations([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data when timeframe or predictionDays changes
  useEffect(() => {
    fetchData();
  }, [timeframe, predictionDays]);

  return {
    predictions,
    isLoading,
    error,
    recommendations,
    predictionDays,
    setPredictionDays,
    refreshData: fetchData,
    modelVersion,
    refetch: fetchData
  };
};

export default usePredictions;
