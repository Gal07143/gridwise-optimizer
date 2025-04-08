
import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { 
  runEnergyOptimization, 
  sendDeviceControl, 
  getAIRecommendations, 
  applyRecommendation,
  getUserPreferences,
  saveUserPreferences
} from '@/services/energyOptimizationService';
import { useAuth } from '@/contexts/auth/AuthContext';
import { AIRecommendation, OptimizationResult, UserPreference } from '@/types/energy';

export function useEnergyOptimization(siteId: string) {
  const { user } = useAuth();
  const userId = user?.id || '';
  
  // Optimization state
  const [optimizationSettings, setOptimizationSettings] = useState({
    objective: 'self_consumption' as 'cost' | 'self_consumption' | 'carbon' | 'peak_shaving',
    minBatterySoc: 20,
    maxBatterySoc: 90,
    evDepartureTime: '',
    evTargetSoc: 80,
  });
  
  // Fetch user preferences
  const preferencesQuery = useQuery({
    queryKey: ['userPreferences', userId],
    queryFn: () => getUserPreferences(userId),
    enabled: !!userId,
  });
  
  // Save user preferences
  const savePreferencesMutation = useMutation({
    mutationFn: (preferences: Partial<UserPreference>) => 
      saveUserPreferences(userId, preferences as any),
  });
  
  // Fetch AI recommendations
  const recommendationsQuery = useQuery({
    queryKey: ['aiRecommendations', siteId],
    queryFn: () => getAIRecommendations(siteId),
    enabled: !!siteId,
  });
  
  // Apply a recommendation
  const applyRecommendationMutation = useMutation({
    mutationFn: (recommendationId: string) => 
      applyRecommendation(recommendationId, userId),
    onSuccess: () => {
      recommendationsQuery.refetch();
    },
  });
  
  // Run energy optimization
  const optimizationMutation = useMutation({
    mutationFn: (deviceIds: string[]) => 
      runEnergyOptimization(
        siteId,
        deviceIds,
        optimizationSettings.objective,
        {
          minBatterySoc: optimizationSettings.minBatterySoc,
          maxBatterySoc: optimizationSettings.maxBatterySoc,
          evDepartureTime: optimizationSettings.evDepartureTime || undefined,
          evTargetSoc: optimizationSettings.evTargetSoc,
        }
      ),
  });
  
  // Send control command to device
  const controlDeviceMutation = useMutation({
    mutationFn: ({ 
      deviceId, 
      command, 
      parameters 
    }: { 
      deviceId: string; 
      command: string; 
      parameters?: Record<string, any>;
    }) => 
      sendDeviceControl(deviceId, command, parameters),
  });
  
  return {
    // Optimization
    runOptimization: (deviceIds: string[]) => optimizationMutation.mutate(deviceIds),
    updateSettings: (settings: Partial<typeof optimizationSettings>) => 
      setOptimizationSettings(prev => ({ ...prev, ...settings })),
    currentSettings: optimizationSettings,
    isOptimizing: optimizationMutation.isPending,
    optimizationResult: optimizationMutation.data as OptimizationResult | null,
    optimizationError: optimizationMutation.error,
    
    // Device control
    controlDevice: controlDeviceMutation.mutate,
    isControlling: controlDeviceMutation.isPending,
    controlError: controlDeviceMutation.error,
    
    // Recommendations
    recommendations: recommendationsQuery.data as AIRecommendation[] || [],
    isLoadingRecommendations: recommendationsQuery.isLoading,
    applyRecommendation: (id: string) => applyRecommendationMutation.mutate(id),
    isApplyingRecommendation: applyRecommendationMutation.isPending,
    
    // User preferences
    preferences: preferencesQuery.data,
    isLoadingPreferences: preferencesQuery.isLoading,
    savePreferences: savePreferencesMutation.mutate,
    isSavingPreferences: savePreferencesMutation.isPending,
    
    // Refresh data
    refreshRecommendations: recommendationsQuery.refetch,
    refreshPreferences: preferencesQuery.refetch,
  };
}
