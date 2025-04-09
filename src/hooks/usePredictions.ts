
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { SystemRecommendation } from '@/types/energy';

export type { SystemRecommendation };

export const usePredictions = () => {
  const [recommendations, setRecommendations] = useState<SystemRecommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRecommendations = async (siteId: string) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('ai_recommendations')
        .select('*')
        .eq('site_id', siteId)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }
      setRecommendations(data as SystemRecommendation[]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const applyRecommendation = async (recommendationId: string) => {
    try {
      const { data, error } = await supabase
        .from('ai_recommendations')
        .update({ applied: true, applied_at: new Date().toISOString() })
        .eq('id', recommendationId)
        .select();
      
      if (error) throw error;
      
      return data;
    } catch (error: any) {
      console.error('Error applying recommendation:', error);
      throw error;
    }
  };

  // For compatibility with components that expect predictions
  const compatibilityProps = {
    recommendations,
    loading,
    error,
    fetchRecommendations,
    applyRecommendation,
    // Compatibility aliases
    predictions: recommendations,
    isLoading: loading,
    fetchPredictions: fetchRecommendations,
    refetch: (siteId: string = 'default') => fetchRecommendations(siteId)
  };

  return compatibilityProps;
};

// Export applyRecommendation as a standalone function for backward compatibility
export const applyRecommendation = async (recommendationId: string) => {
  try {
    const { data, error } = await supabase
      .from('ai_recommendations')
      .update({ applied: true, applied_at: new Date().toISOString() })
      .eq('id', recommendationId)
      .select();
    
    if (error) throw error;
    
    return data;
  } catch (error: any) {
    console.error('Error applying recommendation:', error);
    throw error;
  }
};
