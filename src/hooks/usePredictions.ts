
import { useState } from 'react';
import { toast } from 'sonner';

interface Prediction {
  time: string;
  consumption: number;
  consumptionPredicted: number;
  production: number;
  productionPredicted: number;
  savings: number;
  savingsPredicted: number;
}

interface Recommendation {
  id: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  category: 'energy' | 'cost' | 'maintenance';
  applied: boolean;
  appliedAt?: string;
  priority: number;
}

export function usePredictions() {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);

  const fetchPredictions = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Mock data
      const now = new Date();
      const mockData: Prediction[] = Array.from({ length: 24 }, (_, i) => {
        const time = new Date(now);
        time.setHours(time.getHours() + i);
        
        return {
          time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          consumption: Math.random() * 10 + 5,
          consumptionPredicted: Math.random() * 10 + 5,
          production: Math.random() * 8 + (i > 6 && i < 18 ? 5 : 0), // Higher during daylight
          productionPredicted: Math.random() * 8 + (i > 6 && i < 18 ? 5 : 0),
          savings: Math.random() * 5 + 1,
          savingsPredicted: Math.random() * 5 + 2,
        };
      });
      
      setPredictions(mockData);
      
      // Mock recommendations
      const mockRecommendations: Recommendation[] = [
        {
          id: 'rec-1',
          title: 'Shift EV charging to solar peak hours',
          description: 'Moving EV charging to 10am-2pm would save approximately $45 per month',
          impact: 'high',
          category: 'cost',
          applied: false,
          priority: 1
        },
        {
          id: 'rec-2',
          title: 'Battery optimization settings',
          description: 'Update battery settings to prioritize self-consumption',
          impact: 'medium',
          category: 'energy',
          applied: false,
          priority: 2
        },
        {
          id: 'rec-3',
          title: 'Solar panel maintenance',
          description: 'Schedule cleaning for improved efficiency',
          impact: 'medium',
          category: 'maintenance',
          applied: false,
          priority: 3
        }
      ];
      
      setRecommendations(mockRecommendations);
      
    } catch (err) {
      console.error('Error fetching predictions:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch predictions'));
    } finally {
      setIsLoading(false);
    }
  };
  
  const applyRecommendation = async (id: string): Promise<boolean> => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setRecommendations(prev => 
        prev.map(rec => 
          rec.id === id 
            ? { ...rec, applied: true, appliedAt: new Date().toISOString() } 
            : rec
        )
      );
      
      toast.success('Recommendation applied successfully');
      return true;
    } catch (error) {
      console.error('Failed to apply recommendation:', error);
      toast.error('Failed to apply recommendation');
      return false;
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
}

export const applyRecommendation = async (id: string): Promise<boolean> => {
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    toast.success('Recommendation applied successfully');
    return true;
  } catch (error) {
    console.error('Failed to apply recommendation:', error);
    toast.error('Failed to apply recommendation');
    return false;
  }
};

export default usePredictions;
