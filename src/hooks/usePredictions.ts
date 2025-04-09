
import { useState } from 'react';
import { toast } from 'sonner';

export interface SystemRecommendation {
  id: string;
  title: string;
  description: string;
  potentialSavings?: number;
  potential_savings?: string; // For backward compatibility
  implementation_effort?: string;
  impact: 'low' | 'medium' | 'high';
  type: 'energy' | 'cost' | 'maintenance' | 'carbon';
  createdAt: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'applied' | 'dismissed';
  confidence: number; // Add missing confidence field
}

export interface Prediction {
  date: string;
  production: number;
  consumption: number;
  difference: number;
}

export const usePredictions = () => {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [predictionDays, setPredictionDays] = useState<number>(7);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const generatePredictions = async (): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate mock predictions
      const mockPredictions: Prediction[] = [];
      const today = new Date();
      
      for (let i = 0; i < predictionDays; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() + i);
        
        const production = Math.round(Math.random() * 50) + 20;
        const consumption = Math.round(Math.random() * 40) + 15;
        
        mockPredictions.push({
          date: date.toISOString().split('T')[0],
          production,
          consumption,
          difference: production - consumption
        });
      }
      
      setPredictions(mockPredictions);
      toast.success('Predictions generated successfully');
      return true;
    } catch (e) {
      const err = e instanceof Error ? e : new Error('Unknown error occurred');
      setError(err);
      toast.error('Failed to generate predictions');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    predictions,
    error,
    predictionDays,
    setPredictionDays,
    generatePredictions,
    isLoading
  };
};

export default usePredictions;
