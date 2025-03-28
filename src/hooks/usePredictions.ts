
import { useState, useEffect } from 'react';
import { useSiteContext } from '@/contexts/SiteContext';
import { toast } from 'sonner';

export interface SystemRecommendation {
  id: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  difficulty: 'easy' | 'moderate' | 'complex';
  status: 'new' | 'in_progress' | 'completed' | 'rejected';
  created_at: string;
  category: string;
  estimated_roi: number;
  potential_savings: number;
  implementation_effort: string;
  confidence: number;
}

export interface UsePredictionsResult {
  predictions: any[];
  recommendations: SystemRecommendation[];
  isLoading: boolean;
  error: Error | null;
  predictionDays: number;
  setPredictionDays: (days: number) => void;
  timeframe: 'day' | 'week' | 'month' | 'year';
  setTimeframe: (timeframe: 'day' | 'week' | 'month' | 'year') => void;
  refetch: () => void;
}

export const usePredictions = (initialTimeframe: 'day' | 'week' | 'month' | 'year' = 'week'): UsePredictionsResult => {
  const { activeSite } = useSiteContext();
  const [predictions, setPredictions] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<SystemRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [predictionDays, setPredictionDays] = useState(14);
  const [timeframe, setTimeframe] = useState<'day' | 'week' | 'month' | 'year'>(initialTimeframe);

  useEffect(() => {
    if (activeSite) {
      fetchPredictions();
    }
  }, [activeSite, predictionDays, timeframe]);

  const fetchPredictions = async () => {
    setIsLoading(true);
    try {
      // Mock data for predictions and recommendations
      const mockPredictions = Array.from({ length: 10 }, (_, i) => ({
        date: new Date(Date.now() + i * 86400000).toISOString().slice(0, 10),
        consumption: Math.random() * 100 + 50,
        production: Math.random() * 80 + 20,
        cost: Math.random() * 25 + 10,
      }));

      const mockRecommendations: SystemRecommendation[] = [
        {
          id: "rec-1",
          title: "Adjust battery charging schedule",
          description: "Change battery charging to off-peak hours to reduce electricity costs.",
          impact: "high",
          difficulty: "easy",
          status: "new",
          created_at: new Date().toISOString(),
          category: "efficiency",
          estimated_roi: 120,
          potential_savings: 240,
          implementation_effort: "low",
          confidence: 85
        },
        {
          id: "rec-2",
          title: "Add additional solar panels",
          description: "Increase solar capacity by 20% to reduce grid dependency.",
          impact: "high",
          difficulty: "complex",
          status: "new",
          created_at: new Date().toISOString(),
          category: "expansion",
          estimated_roi: 350,
          potential_savings: 850,
          implementation_effort: "high",
          confidence: 75
        },
        {
          id: "rec-3",
          title: "Optimize HVAC schedule",
          description: "Adjust heating and cooling times based on predicted occupancy.",
          impact: "medium",
          difficulty: "moderate",
          status: "new",
          created_at: new Date().toISOString(),
          category: "optimization",
          estimated_roi: 90,
          potential_savings: 180,
          implementation_effort: "medium",
          confidence: 90
        }
      ];

      setPredictions(mockPredictions);
      setRecommendations(mockRecommendations);
      setError(null);
    } catch (err) {
      console.error("Error fetching predictions:", err);
      setError(err instanceof Error ? err : new Error("Failed to fetch predictions"));
      toast.error("Failed to load energy predictions");
    } finally {
      setIsLoading(false);
    }
  };

  const refetch = () => {
    fetchPredictions();
  };

  return {
    predictions,
    recommendations,
    isLoading,
    error,
    predictionDays,
    setPredictionDays,
    timeframe,
    setTimeframe,
    refetch
  };
};

// Helper function to apply recommendations
export const applyRecommendation = async (recommendationId: string): Promise<boolean> => {
  // Mock implementation
  console.log(`Applying recommendation: ${recommendationId}`);
  await new Promise(resolve => setTimeout(resolve, 1000));
  return true;
};

export default usePredictions;
