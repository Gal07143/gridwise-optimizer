
import { useState, useCallback } from 'react';
import { OptimizationMetrics, OptimizationSettings } from '@/types/optimization';

interface EnergyOptimizationState {
  isOptimizing: boolean;
  settings: OptimizationSettings | null;
  results: OptimizationMetrics | null;
  error: string | null;
}

export const useEnergyOptimization = (siteId: string) => {
  const [state, setState] = useState<EnergyOptimizationState>({
    isOptimizing: false,
    settings: null,
    results: null,
    error: null
  });

  const loadSettings = useCallback(async () => {
    // This would normally fetch settings from an API
    const settings: OptimizationSettings = {
      id: '1',
      name: 'Default Optimization',
      priority: 'balanced',
      objectives: {
        cost_reduction_target: 15,
        emission_reduction_target: 20,
        peak_shaving_target: 10,
        self_consumption_target: 80
      },
      constraints: {
        battery_min_soc: 20,
        grid_feed_in_limit: 70
      },
      schedule: {
        active: true,
        frequency: 'hourly'
      },
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      site_id: siteId
    };
    
    setState(prev => ({ ...prev, settings }));
  }, [siteId]);

  const runOptimization = useCallback(async () => {
    setState(prev => ({ ...prev, isOptimizing: true, error: null }));
    
    try {
      // This would normally call an optimization service
      const results: OptimizationMetrics = {
        timestamp: new Date().toISOString(),
        savings: 15.20,
        co2Reduction: 8.5,
        efficiencyGain: 12.3,
        peakReduction: 25,
        selfConsumption: 75,
        targetMet: true
      };
      
      setState(prev => ({ ...prev, results, isOptimizing: false }));
      return results;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error during optimization';
      setState(prev => ({ ...prev, error: errorMessage, isOptimizing: false }));
      return null;
    }
  }, []);

  return {
    ...state,
    loadSettings,
    runOptimization
  };
};

export default useEnergyOptimization;
