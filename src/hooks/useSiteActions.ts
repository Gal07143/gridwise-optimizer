
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { createSite, updateSite, deleteSite as deleteSiteAPI } from '@/services/sites/siteService';
import { toast } from 'sonner';
import { Site } from '@/types/site';
import useConnectionStatus from './useConnectionStatus';

// Define types for our pending operations
type PendingOperation = {
  id: string;
  type: 'create' | 'update' | 'delete';
  data?: any;
  timestamp: number;
};

export function useSiteActions() {
  const [isProcessing, setIsProcessing] = useState(false);
  const { isOnline } = useConnectionStatus();

  // Create site mutation
  const createSiteMutation = useMutation({
    mutationFn: (newSite: Omit<Site, 'id' | 'created_at' | 'updated_at'>) => {
      if (!isOnline) {
        // Store operation for later
        const tempId = `temp-${Date.now()}`;
        const pendingOp: PendingOperation = {
          id: tempId,
          type: 'create',
          data: newSite,
          timestamp: Date.now()
        };
        
        // Store in localStorage
        storePendingOperation(pendingOp);
        
        // Return a mock site with the temp ID
        return Promise.resolve({
          ...newSite,
          id: tempId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        } as Site);
      }
      
      return createSite(newSite);
    },
    onSuccess: () => {
      toast.success('Site created successfully');
    },
    onError: (error) => {
      toast.error(`Failed to create site: ${error.message}`);
    }
  });

  // Update site mutation
  const updateSiteMutation = useMutation({
    mutationFn: (site: Site) => {
      if (!isOnline) {
        // Store operation for later
        const pendingOp: PendingOperation = {
          id: site.id,
          type: 'update',
          data: site,
          timestamp: Date.now()
        };
        
        // Store in localStorage
        storePendingOperation(pendingOp);
        
        // Return the site as if it was updated
        return Promise.resolve(site);
      }
      
      return updateSite(site);
    },
    onSuccess: () => {
      toast.success('Site updated successfully');
    },
    onError: (error) => {
      toast.error(`Failed to update site: ${error.message}`);
    }
  });

  // Delete site mutation
  const deleteSiteMutation = useMutation({
    mutationFn: (siteId: string) => {
      if (!isOnline) {
        // Store operation for later
        const pendingOp: PendingOperation = {
          id: siteId,
          type: 'delete',
          timestamp: Date.now()
        };
        
        // Store in localStorage
        storePendingOperation(pendingOp);
        
        // Return the siteId as if it was deleted
        return Promise.resolve(siteId);
      }
      
      return deleteSiteAPI(siteId);
    },
    onSuccess: () => {
      toast.success('Site deleted successfully');
    },
    onError: (error) => {
      toast.error(`Failed to delete site: ${error.message}`);
    }
  });

  // Helper to store pending operations
  const storePendingOperation = (operation: PendingOperation) => {
    try {
      const pendingOps = JSON.parse(localStorage.getItem('pendingSiteOperations') || '[]');
      pendingOps.push(operation);
      localStorage.setItem('pendingSiteOperations', JSON.stringify(pendingOps));
    } catch (error) {
      console.error('Error storing pending operation:', error);
    }
  };
  
  // Process pending operations when back online
  const processPendingOperations = async () => {
    try {
      setIsProcessing(true);
      
      const pendingOps: PendingOperation[] = JSON.parse(localStorage.getItem('pendingSiteOperations') || '[]');
      
      if (pendingOps.length === 0) {
        toast.info('No pending operations to process');
        return true;
      }
      
      // Sort operations by timestamp to process in order
      const sortedOps = [...pendingOps].sort((a, b) => a.timestamp - b.timestamp);
      
      let successCount = 0;
      let failCount = 0;
      
      for (const op of sortedOps) {
        try {
          switch (op.type) {
            case 'create':
              await createSite(op.data);
              successCount++;
              break;
              
            case 'update':
              await updateSite(op.data);
              successCount++;
              break;
              
            case 'delete':
              await deleteSiteAPI(op.id);
              successCount++;
              break;
          }
        } catch (error) {
          console.error(`Error processing operation ${op.type} for ${op.id}:`, error);
          failCount++;
        }
      }
      
      localStorage.removeItem('pendingSiteOperations');
      
      if (failCount === 0) {
        toast.success(`Successfully processed ${successCount} pending operations`);
      } else {
        toast.warning(`Processed ${successCount} operations with ${failCount} failures`);
      }
      
      return true;
    } catch (error) {
      console.error('Error processing pending operations:', error);
      toast.error('Failed to process pending operations');
      return false;
    } finally {
      setIsProcessing(false);
    }
  };
  
  return {
    createSite: createSiteMutation.mutate,
    updateSite: updateSiteMutation.mutate,
    deleteSite: deleteSiteMutation.mutate,
    isProcessing,
    processPendingOperations
  };
}
