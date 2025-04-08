
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAppStore } from '@/store/appStore';

interface OptimizationSettings {
  objective: 'self_consumption' | 'cost' | 'carbon' | 'peak_shaving';
  minBatterySoc: number;
  maxBatterySoc: number;
  evDepartureTime: string;
  evTargetSoc: number;
}

const defaultSettings: OptimizationSettings = {
  objective: 'self_consumption',
  minBatterySoc: 20,
  maxBatterySoc: 90,
  evDepartureTime: '08:00',
  evTargetSoc: 80
};

export function useEnergyOptimization(siteId: string) {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [currentSettings, setCurrentSettings] = useState<OptimizationSettings>(defaultSettings);
  const [optimizationResult, setOptimizationResult] = useState<any>(null);
  const { currentSite } = useAppStore();

  const updateSettings = (settings: Partial<OptimizationSettings>) => {
    setCurrentSettings(prev => ({
      ...prev,
      ...settings
    }));
  };

  const runOptimization = async (deviceIds: string[]) => {
    if (!siteId) {
      toast.error('No site selected');
      return;
    }

    setIsOptimizing(true);
    
    try {
      const payload = {
        siteId,
        deviceIds,
        objective: currentSettings.objective,
        constraints: {
          minBatterySoc: currentSettings.minBatterySoc,
          maxBatterySoc: currentSettings.maxBatterySoc,
          evDepartureTime: currentSettings.evDepartureTime,
          evTargetSoc: currentSettings.evTargetSoc
        }
      };

      // Call the Supabase Edge Function for optimization
      const { data, error } = await supabase.functions.invoke('optimize-energy', {
        body: payload
      });

      if (error) throw error;

      console.log('Optimization result:', data);
      setOptimizationResult(data);
      toast.success('Energy optimization completed successfully');
      
      // If recommendations were created, notify the user
      if (data.recommendations > 0) {
        toast.info(`${data.recommendations} new recommendations available`);
      }
      
      return data;
    } catch (error) {
      console.error('Error running optimization:', error);
      toast.error('Failed to run energy optimization');
    } finally {
      setIsOptimizing(false);
    }
  };

  return {
    runOptimization,
    updateSettings,
    currentSettings,
    isOptimizing,
    optimizationResult
  };
}

export default useEnergyOptimization;
