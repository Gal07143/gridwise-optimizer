
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';
import { createSite, deleteSite, updateSite } from '@/services/sites/siteService';
import { Site, SiteFormData } from '@/types/site';
import useConnectionStatus from '@/hooks/useConnectionStatus';

interface PendingAction {
  type: 'create' | 'update' | 'delete';
  data?: SiteFormData;
  id?: string;
}

export const useSiteActions = () => {
  const [pendingActions, setPendingActions] = useState<PendingAction[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { isOnline } = useConnectionStatus({ showToasts: false });

  // Create site mutation
  const createSiteMutation = useMutation({
    mutationFn: async (siteData: SiteFormData) => {
      if (!isOnline) {
        // Store for later when online
        setPendingActions(prev => [...prev, { type: 'create', data: siteData }]);
        return null;
      }
      
      return createSite(siteData);
    },
  });

  // Update site mutation
  const updateSiteMutation = useMutation({
    mutationFn: async (params: { id: string; data: Partial<Site> }) => {
      if (!isOnline) {
        // Store for later when online
        setPendingActions(prev => [...prev, { 
          type: 'update', 
          id: params.id, 
          data: params.data as SiteFormData 
        }]);
        return null;
      }
      
      return updateSite(params.id, params.data);
    },
  });

  // Delete site mutation
  const deleteSiteMutation = useMutation({
    mutationFn: async (siteId: string) => {
      if (!isOnline) {
        // Store for later when online
        setPendingActions(prev => [...prev, { type: 'delete', id: siteId }]);
        return true;
      }
      
      const result = await deleteSite(siteId);
      return result;
    },
  });

  // Process pending operations when back online
  const processPendingOperations = async () => {
    if (!isOnline || pendingActions.length === 0 || isProcessing) {
      return { processed: 0, failed: 0 };
    }
    
    setIsProcessing(true);
    let processed = 0;
    let failed = 0;
    
    const actionsToProcess = [...pendingActions];
    setPendingActions([]);
    
    try {
      for (const action of actionsToProcess) {
        try {
          switch (action.type) {
            case 'create':
              if (action.data) {
                await createSite(action.data);
                processed++;
              }
              break;
            case 'update':
              if (action.id && action.data) {
                await updateSite(action.id, action.data);
                processed++;
              }
              break;
            case 'delete':
              if (action.id) {
                await deleteSite(action.id);
                processed++;
              }
              break;
          }
        } catch (error) {
          console.error(`Failed to process ${action.type} action:`, error);
          failed++;
          // Re-add failed action back to the queue
          setPendingActions(prev => [...prev, action]);
        }
      }
      
      if (processed > 0) {
        toast.success(`Processed ${processed} pending site operation(s)`);
      }
      if (failed > 0) {
        toast.error(`Failed to process ${failed} operation(s)`);
      }
      
      return { processed, failed };
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    // Mutations
    createSite: createSiteMutation.mutate,
    updateSite: updateSiteMutation.mutate,
    deleteSite: deleteSiteMutation.mutate,
    
    // Pending actions
    isProcessing,
    processPendingOperations,
    pendingActionsCount: pendingActions.length,
    
    // Loading states for display
    isLoading: createSiteMutation.isPending || updateSiteMutation.isPending || deleteSiteMutation.isPending,
    
    // Error states
    createError: createSiteMutation.error,
    updateError: updateSiteMutation.error,
    deleteError: deleteSiteMutation.error
  };
};
