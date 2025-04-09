
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Prediction, SystemRecommendation } from '@/types/energy';
import { toast } from 'sonner';

export function usePredictions() {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [recommendations, setRecommendations] = useState<SystemRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchPredictions = async () => {
    try {
      setIsLoading(true);
      
      // Fetch predictions
      const { data: predictionsData, error: predictionsError } = await supabase
        .from('energy_predictions')
        .select('*')
        .order('prediction_time', { ascending: false })
        .limit(10);
      
      if (predictionsError) throw predictionsError;
      
      // Fetch recommendations
      const { data: recommendationsData, error: recommendationsError } = await supabase
        .from('ai_recommendations')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (recommendationsError) throw recommendationsError;
      
      setPredictions(predictionsData as Prediction[]);
      setRecommendations(recommendationsData as SystemRecommendation[]);
    } catch (err) {
      console.error('Error fetching predictions and recommendations:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch data'));
    } finally {
      setIsLoading(false);
    }
  };

  const applyRecommendation = async (id: string) => {
    try {
      const { error } = await supabase
        .from('ai_recommendations')
        .update({
          applied: true,
          applied_at: new Date().toISOString(),
          applied_by: (await supabase.auth.getUser()).data?.user?.id
        })
        .eq('id', id);
      
      if (error) throw error;
      
      // Update local state
      setRecommendations(prev => prev.map(rec => 
        rec.id === id ? { ...rec, applied: true, applied_at: new Date().toISOString() } : rec
      ));
      
      toast.success("Recommendation applied successfully");
      return true;
    } catch (err) {
      console.error('Error applying recommendation:', err);
      toast.error('Failed to apply recommendation');
      return false;
    }
  };

  useEffect(() => {
    fetchPredictions();
  }, []);

  return {
    predictions,
    recommendations,
    isLoading,
    error,
    fetchPredictions,
    applyRecommendation,
    refetch: fetchPredictions
  };
}

export default usePredictions;
export type { SystemRecommendation };
export { applyRecommendation };
