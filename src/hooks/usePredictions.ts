
import { useState } from 'react';
import { useToast } from './useToast';

interface Prediction {
  time: string;
  consumption: number;
  consumptionPredicted: number;
  production: number;
  productionPredicted: number;
  savings: number;
  savingsPredicted: number;
  confidence?: number;
}

interface Recommendation {
  id: string;
  title: string;
  description: string;
  potentialSavings: number;
  confidence: number;
  priority: 'low' | 'medium' | 'high';
  implemented: boolean;
}

export const usePredictions = () => {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const toast = useToast();

  const fetchPredictions = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call with mock data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate mock prediction data
      const mockPredictions: Prediction[] = Array.from({ length: 24 }).map((_, i) => {
        const hour = i.toString().padStart(2, '0');
        const baseConsumption = 2 + Math.sin(i / 3) * 1.5;
        const baseProduction = i > 6 && i < 20 ? 3 + Math.sin((i - 6) / 4) * 2 : 0.2;
        
        return {
          time: `${hour}:00`,
          consumption: baseConsumption + Math.random() * 0.5,
          consumptionPredicted: baseConsumption,
          production: baseProduction + Math.random() * 1,
          productionPredicted: baseProduction,
          savings: (baseProduction * 0.15) + Math.random() * 0.2,
          savingsPredicted: baseProduction * 0.15,
          confidence: 0.7 + Math.random() * 0.2
        };
      });
      
      // Mock recommendations
      const mockRecommendations: Recommendation[] = [
        {
          id: '1',
          title: 'Shift EV charging to off-peak hours',
          description: 'Charging your EV during off-peak hours (10PM-6AM) could save up to 30% on charging costs.',
          potentialSavings: 42.50,
          confidence: 0.87,
          priority: 'high',
          implemented: false
        },
        {
          id: '2',
          title: 'Optimize battery usage during peak hours',
          description: 'Using stored battery energy during peak demand periods (5PM-8PM) can reduce grid usage.',
          potentialSavings: 28.75,
          confidence: 0.92,
          priority: 'medium',
          implemented: false
        },
        {
          id: '3',
          title: 'Reduce HVAC usage during solar production dips',
          description: 'Temporarily reducing HVAC intensity during cloudy periods can better match your solar production.',
          potentialSavings: 15.20,
          confidence: 0.76,
          priority: 'low',
          implemented: false
        }
      ];
      
      setPredictions(mockPredictions);
      setRecommendations(mockRecommendations);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch predictions'));
      toast.error('Failed to load predictions');
    } finally {
      setIsLoading(false);
    }
  };

  const applyRecommendation = async (recommendationId: string) => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Update recommendations list with implemented flag
      setRecommendations(prev => 
        prev.map(rec => 
          rec.id === recommendationId ? { ...rec, implemented: true } : rec
        )
      );
      
      toast.success('Recommendation applied successfully');
      return true;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to apply recommendation');
      setError(error);
      toast.error(error.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    predictions,
    recommendations,
    isLoading,
    error,
    fetchPredictions,
    applyRecommendation
  };
};
