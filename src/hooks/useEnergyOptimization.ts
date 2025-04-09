
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { OptimizationSettings, SystemRecommendation } from '@/types/energy';

// Default optimization settings
const defaultSettings: OptimizationSettings = {
  minBatterySoc: 20,
  maxBatterySoc: 90,
  evTargetSoc: 80,
  evDepartureTime: '08:00',
  objective: 'self_consumption',
};

export const useEnergyOptimization = (siteId: string) => {
  const [currentSettings, setCurrentSettings] = useState<OptimizationSettings>(defaultSettings);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationResult, setOptimizationResult] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<SystemRecommendation[]>([]);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false);
  const [isApplyingRecommendation, setIsApplyingRecommendation] = useState(false);

  // Update optimization settings
  const updateSettings = useCallback((settings: Partial<OptimizationSettings>) => {
    setCurrentSettings(prev => ({
      ...prev,
      ...settings
    }));
  }, []);

  // Run optimization algorithm
  const runOptimization = useCallback(async (deviceIds: string[]) => {
    if (!siteId) return;
    setIsOptimizing(true);

    try {
      // Simulate optimization API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock optimization result
      const result = {
        success: true,
        schedule: {
          battery: {
            'charge': [
              { start: '02:00', end: '06:00', power: 3.5 },
              { start: '12:00', end: '15:00', power: 2.0 },
            ],
            'discharge': [
              { start: '17:00', end: '21:00', power: 2.5 },
            ]
          },
          ev_charging: [
            { start: '13:30', end: '16:30', power: 7.0 }
          ]
        },
        savings: {
          cost: 3.42,
          co2: 2.1
        }
      };
      
      setOptimizationResult(result);
      toast.success('Optimization completed successfully!');
      
      // Load mock recommendations after optimization
      loadRecommendations();

      return result;
    } catch (error) {
      console.error('Optimization failed:', error);
      toast.error('Optimization failed. Please try again.');
      return null;
    } finally {
      setIsOptimizing(false);
    }
  }, [siteId]);

  // Load recommendations
  const loadRecommendations = useCallback(async () => {
    if (!siteId) return;
    setIsLoadingRecommendations(true);

    try {
      // Simulate API call for recommendations
      await new Promise(resolve => setTimeout(resolve, 1200));

      // Mock recommendations data
      const mockRecommendations: SystemRecommendation[] = [
        {
          id: '1',
          title: 'Adjust battery to match solar peak',
          description: 'Your battery is charging too early. Adjust to charge during peak solar production.',
          potential_savings: '€32/month',
          potentialSavings: 32,
          impact: 'high',
          type: 'energy',
          createdAt: new Date().toISOString(),
          priority: 'high',
          status: 'pending',
          confidence: 87,
          implementation_effort: 'Easy'
        },
        {
          id: '2',
          title: 'EV charging optimization',
          description: 'Schedule EV charging during off-peak hours to reduce costs.',
          potential_savings: '€18/month',
          potentialSavings: 18,
          impact: 'medium',
          type: 'cost',
          createdAt: new Date().toISOString(),
          priority: 'medium',
          status: 'pending',
          confidence: 92,
          implementation_effort: 'Easy'
        }
      ];

      setRecommendations(mockRecommendations);
    } catch (error) {
      console.error('Failed to load recommendations:', error);
    } finally {
      setIsLoadingRecommendations(false);
    }
  }, [siteId]);

  // Apply recommendation
  const applyRecommendation = useCallback(async (recommendationId: string) => {
    setIsApplyingRecommendation(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Update the recommendation status
      setRecommendations(prev => 
        prev.map(rec => rec.id === recommendationId 
          ? { ...rec, status: 'applied' as const } 
          : rec
        )
      );

      toast.success('Recommendation applied successfully');
      return true;
    } catch (error) {
      console.error('Failed to apply recommendation:', error);
      toast.error('Failed to apply recommendation');
      return false;
    } finally {
      setIsApplyingRecommendation(false);
    }
  }, []);

  return {
    runOptimization,
    updateSettings,
    currentSettings,
    isOptimizing,
    optimizationResult,
    recommendations,
    isLoadingRecommendations,
    applyRecommendation,
    isApplyingRecommendation
  };
};
