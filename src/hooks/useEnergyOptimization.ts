import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { OptimizationSettings } from '@/types/optimization';

// Define device control command interfaces
interface DeviceControlCommand {
  deviceId: string;
  command: string;
  parameters?: Record<string, any>;
}

interface OptimizationResult {
  success: boolean;
  schedule: {
    battery: {
      charge: { start: string; end: string; power: number }[];
      discharge: { start: string; end: string; power: number }[];
    };
    ev_charging: {
      start: string;
      end: string;
      power: number;
      vehicle_id: string;
    }[];
  };
  savings: {
    cost: number;
    co2: number;
  };
}

export const useEnergyOptimization = (siteId: string) => {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isControlling, setIsControlling] = useState(false);
  const [optimizationResult, setOptimizationResult] = useState<any>(null);
  const [currentSettings, setCurrentSettings] = useState<OptimizationSettings>({
    priority: 'cost',
    battery_strategy: 'time_of_use',
    ev_charging_time: '01:00',
    ev_departure_time: '08:00',
    peak_shaving_enabled: true,
    min_soc: 20,
    max_soc: 90,
    minBatterySoc: 20,
    maxBatterySoc: 90,
    priority_device_ids: [],
    time_window_start: '00:00',
    time_window_end: '23:59',
    evTargetSoc: 80
  });

  // Recommendation management
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false);
  const [isApplyingRecommendation, setIsApplyingRecommendation] = useState(false);

  const updateSettings = useCallback((settings: Partial<OptimizationSettings>) => {
    setCurrentSettings(prev => {
      const updated = { ...prev, ...settings };
      
      // Keep aliases in sync
      if (settings.min_soc !== undefined) updated.minBatterySoc = settings.min_soc;
      if (settings.max_soc !== undefined) updated.maxBatterySoc = settings.max_soc;
      if (settings.minBatterySoc !== undefined) updated.min_soc = settings.minBatterySoc;
      if (settings.maxBatterySoc !== undefined) updated.max_soc = settings.maxBatterySoc;
      if (settings.priority !== undefined) updated.objective = settings.priority;
      if (settings.objective !== undefined) updated.priority = settings.objective;
      
      return updated;
    });
    toast.success('Optimization settings updated');
  }, []);

  const runOptimization = useCallback(async (deviceIds: string[]): Promise<OptimizationResult> => {
    setIsOptimizing(true);
    
    try {
      // Mock API call with a timeout
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock result
      const result = {
        success: true,
        schedule: {
          battery: {
            charge: [
              { start: '01:00', end: '05:00', power: 3.5 },
              { start: '13:00', end: '16:00', power: 2.5 }
            ],
            discharge: [
              { start: '07:00', end: '09:00', power: 2.0 },
              { start: '17:00', end: '21:00', power: 3.0 }
            ]
          },
          ev_charging: [
            { start: '02:00', end: '06:00', power: 7.0, vehicle_id: 'ev1' }
          ]
        },
        savings: {
          cost: 4.32,
          co2: 12.5
        }
      };
      
      toast.success('Optimization completed successfully');
      setOptimizationResult(result);
      return result;
    } catch (error) {
      toast.error('Optimization failed');
      console.error('Optimization error:', error);
      throw error;
    } finally {
      setIsOptimizing(false);
    }
  }, []);

  // Device control function
  const controlDevice = useCallback(async (command: DeviceControlCommand) => {
    setIsControlling(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log(`Control command sent to device ${command.deviceId}:`, command);
      toast.success(`Command '${command.command}' sent to device`);
      
      // Return mock response
      return { success: true, message: 'Command executed successfully' };
    } catch (error) {
      console.error('Error controlling device:', error);
      toast.error('Failed to control device');
      throw error;
    } finally {
      setIsControlling(false);
    }
  }, []);

  // Apply recommendation
  const applyRecommendation = useCallback(async (recommendationId: string) => {
    setIsApplyingRecommendation(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update recommendations list - mark as applied
      setRecommendations(prev => 
        prev.map(rec => 
          rec.id === recommendationId ? { ...rec, status: 'applied' } : rec
        )
      );
      
      toast.success('Recommendation applied successfully');
      return true;
    } catch (error) {
      console.error('Error applying recommendation:', error);
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
    controlDevice,
    isControlling,
    recommendations,
    isLoadingRecommendations,
    applyRecommendation,
    isApplyingRecommendation
  };
};

export default useEnergyOptimization;
