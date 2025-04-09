
import { useState, useEffect } from 'react';

// Define SystemRecommendation interface and export it
export interface SystemRecommendation {
  id: string;
  title: string;
  description: string;
  potentialSavings?: number;
  potential_savings?: string;
  implementation_effort?: string;
  impact: 'low' | 'medium' | 'high';
  type: 'energy' | 'cost' | 'maintenance' | 'carbon';
  createdAt: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'applied' | 'dismissed';
  confidence: number;
}

// Sample prediction data for demo
const samplePredictions = [
  { day: 'Mon', value: 42.3, confidence: 0.91 },
  { day: 'Tue', value: 45.7, confidence: 0.89 },
  { day: 'Wed', value: 51.2, confidence: 0.87 },
  { day: 'Thu', value: 48.9, confidence: 0.85 },
  { day: 'Fri', value: 53.8, confidence: 0.82 },
  { day: 'Sat', value: 46.5, confidence: 0.79 },
  { day: 'Sun', value: 42.1, confidence: 0.81 }
];

// Sample recommendations for demo
const sampleRecommendations: SystemRecommendation[] = [
  {
    id: '1',
    title: 'Optimize battery charging cycle',
    description: 'Your battery is charging during peak hours. Shifting to off-peak could save you money.',
    potentialSavings: 42,
    potential_savings: '42€ per month',
    implementation_effort: 'Easy',
    impact: 'high',
    type: 'cost',
    createdAt: new Date().toISOString(),
    priority: 'high',
    status: 'pending',
    confidence: 89
  },
  {
    id: '2',
    title: 'Reduce solar panel shadowing',
    description: 'Tree shadows are reducing your solar panel efficiency by approximately 15%.',
    potentialSavings: 28,
    potential_savings: '28€ per month',
    implementation_effort: 'Medium',
    impact: 'medium',
    type: 'energy',
    createdAt: new Date().toISOString(),
    priority: 'medium',
    status: 'pending',
    confidence: 75
  }
];

// Function to apply a recommendation
export async function applyRecommendation(recommendationId: string) {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  return { success: true };
}

interface UsePredictionsOptions {
  siteId?: string;
  initialDays?: number;
}

export default function usePredictions(timeframe: 'day' | 'week' | 'month' | 'year' = 'week', options?: UsePredictionsOptions) {
  const [predictions, setPredictions] = useState<Array<{day: string, value: number, confidence: number}>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [recommendations, setRecommendations] = useState<SystemRecommendation[]>([]);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState<boolean>(false);
  const [isApplyingRecommendation, setIsApplyingRecommendation] = useState<boolean>(false);
  const [predictionDays, setPredictionDays] = useState<number>(options?.initialDays || 7);
  
  const generatePredictions = async (): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setPredictions(samplePredictions.slice(0, predictionDays));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to generate predictions'));
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const applyRecommendationHandler = async (id: string) => {
    setIsApplyingRecommendation(true);
    try {
      await applyRecommendation(id);
      setRecommendations(prev => 
        prev.map(rec => rec.id === id ? { ...rec, status: 'applied' as const } : rec)
      );
      return true;
    } catch (err) {
      console.error('Failed to apply recommendation:', err);
      return false;
    } finally {
      setIsApplyingRecommendation(false);
    }
  };

  const loadRecommendations = async () => {
    setIsLoadingRecommendations(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setRecommendations(sampleRecommendations);
    } catch (err) {
      console.error('Failed to load recommendations:', err);
    } finally {
      setIsLoadingRecommendations(false);
    }
  };

  useEffect(() => {
    generatePredictions();
    loadRecommendations();
  }, [timeframe, predictionDays]);

  const refetch = () => {
    generatePredictions();
    loadRecommendations();
  };

  return { 
    predictions, 
    isLoading, 
    error, 
    predictionDays,
    setPredictionDays,
    generatePredictions,
    recommendations,
    isLoadingRecommendations,
    applyRecommendation: applyRecommendationHandler,
    isApplyingRecommendation,
    refetch
  };
}
