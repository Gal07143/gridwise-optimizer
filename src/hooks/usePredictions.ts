import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { SystemRecommendation } from '@/types/energy';

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
  } catch (error) {
    console.error('Error applying recommendation:', error);
    throw error;
  }
};

  return {
    recommendations,
    loading,
    error,
    fetchRecommendations,
    applyRecommendation
  };
};
