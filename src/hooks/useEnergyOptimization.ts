
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { AIRecommendation } from '@/types/energy';

export interface OptimizationSettings {
  enableTimeShifting: boolean;
  enablePeakShaving: boolean;
  enableBatteryOptimization: boolean;
  enableDynamicCharging: boolean;
  maxDischargeRate: number;
  selfConsumptionTarget: number;
  economyMode: boolean;
}

const defaultSettings: OptimizationSettings = {
  enableTimeShifting: true,
  enablePeakShaving: true,
  enableBatteryOptimization: true,
  enableDynamicCharging: true,
  maxDischargeRate: 80,
  selfConsumptionTarget: 90,
  economyMode: false
};

// Sample recommendations
const mockRecommendations: AIRecommendation[] = [
  {
    id: '1',
    site_id: 'site-1',
    type: 'battery_optimization',
    priority: 'high',
    title: 'Optimize battery charging schedule',
    description: 'Shifting battery charging to off-peak hours can reduce your electricity costs by up to 15%.',
    potential_savings: '€45 per month',
    confidence: 0.92,
    applied: false
  },
  {
    id: '2',
    site_id: 'site-1',
    type: 'load_shifting',
    priority: 'medium',
    title: 'Shift EV charging to midday',
    description: 'Charging your EV during peak solar production hours increases self-consumption by 25%.',
    potential_savings: '€30 per month',
    confidence: 0.85,
    applied: false
  }
];

export function useEnergyOptimization(siteId: string) {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [currentSettings, setCurrentSettings] = useState<OptimizationSettings>(defaultSettings);
  const [optimizationResult, setOptimizationResult] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>(mockRecommendations);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false);
  const [isApplyingRecommendation, setIsApplyingRecommendation] = useState(false);
  const [isControlling, setIsControlling] = useState(false);

  const runOptimization = useCallback(async (deviceIds: string[]) => {
    setIsOptimizing(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const result = {
        success: true,
        optimizedSchedule: [
          { time: '00:00', action: 'charge_battery', value: 2.1 },
          { time: '04:00', action: 'charge_battery', value: 2.5 },
          { time: '08:00', action: 'discharge_battery', value: 1.2 },
          { time: '12:00', action: 'charge_ev', value: 7.4 },
          { time: '16:00', action: 'discharge_battery', value: 3.5 },
          { time: '20:00', action: 'idle', value: 0 }
        ],
        projectedSavings: {
          cost: 42.5,
          co2: 15.3
        }
      };
      
      setOptimizationResult(result);
      toast.success('Optimization completed successfully');
      return result;
    } catch (error) {
      console.error('Optimization failed:', error);
      toast.error('Failed to run optimization');
      throw error;
    } finally {
      setIsOptimizing(false);
    }
  }, []);

  const updateSettings = useCallback((settings: Partial<OptimizationSettings>) => {
    setCurrentSettings(prev => ({ ...prev, ...settings }));
  }, []);

  const applyRecommendation = useCallback(async (recommendationId: string) => {
    setIsApplyingRecommendation(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      setRecommendations(prev => 
        prev.map(rec => 
          rec.id === recommendationId ? { ...rec, applied: true, applied_at: new Date().toISOString() } : rec
        )
      );
      
      toast.success('Recommendation applied successfully');
      return true;
    } catch (error) {
      console.error('Failed to apply recommendation:', error);
      toast.error('Could not apply recommendation');
      return false;
    } finally {
      setIsApplyingRecommendation(false);
    }
  }, []);

  const controlDevice = useCallback(async (params: { deviceId: string, command: string, parameters?: Record<string, any> }) => {
    setIsControlling(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      toast.success(`Command '${params.command}' sent successfully`);
      return true;
    } catch (error) {
      console.error('Device control failed:', error);
      toast.error('Failed to send command to device');
      return false;
    } finally {
      setIsControlling(false);
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
    isApplyingRecommendation,
    controlDevice,
    isControlling
  };
}
