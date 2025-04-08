
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface SystemRecommendation {
  id: string;
  title: string;
  description: string;
  potentialSavings?: number;
  impact: 'low' | 'medium' | 'high';
  type: string;
  createdAt: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'applied' | 'dismissed';
}

export const applyRecommendation = async (recommendationId: string) => {
  try {
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('You must be logged in to apply recommendations');
    }

    // Update the recommendation status in the database
    const { data, error } = await supabase
      .from('ai_recommendations')
      .update({ 
        applied: true,
        applied_at: new Date().toISOString(),
        applied_by: user.id
      })
      .eq('id', recommendationId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error applying recommendation:', error);
    toast.error('Failed to apply recommendation');
    return false;
  }
};

export const useEnergyPredictions = (siteId?: string) => {
  const [isLoading, setIsLoading] = useState(false);

  const generatePredictions = async () => {
    if (!siteId) {
      toast.error('No site selected');
      return;
    }

    setIsLoading(true);
    
    try {
      // In a real implementation, this would call a machine learning service
      // For now, we'll simulate this with a timer
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('Energy predictions generated successfully');
      return true;
    } catch (error) {
      console.error('Error generating predictions:', error);
      toast.error('Failed to generate predictions');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    generatePredictions,
    isLoading
  };
};

export default useEnergyPredictions;
