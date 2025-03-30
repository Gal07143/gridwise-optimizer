
import { useState, useCallback } from 'react';
import { Site } from '@/types/site';
import { createSite, updateSite, deleteSite } from '@/services/sites/siteService';
import { toast } from 'sonner';
import { useSiteContext } from '@/contexts/SiteContext';
import { useQueryClient } from '@tanstack/react-query';
import { retryWithBackoff, isNetworkError } from '@/utils/errorUtils';
import useConnectionStatus from './useConnectionStatus';

export function useSiteActions() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { refreshSites } = useSiteContext();
  const queryClient = useQueryClient();
  const { isOnline } = useConnectionStatus({ showToasts: false });
  
  // Helper to handle local storage fallback when offline
  const saveToLocalStorage = useCallback((key: string, data: any) => {
    try {
      const pendingOperations = JSON.parse(localStorage.getItem('pendingSiteOperations') || '[]');
      pendingOperations.push({ key, data, timestamp: new Date().toISOString() });
      localStorage.setItem('pendingSiteOperations', JSON.stringify(pendingOperations));
      return true;
    } catch (err) {
      console.error('Failed to save to local storage:', err);
      return false;
    }
  }, []);

  const handleCreate = useCallback(async (siteData: Partial<Site>): Promise<Site | null> => {
    setIsLoading(true);
    setError(null);
    
    // Check if we're online first
    if (!isOnline) {
      const localSaved = saveToLocalStorage('create', siteData);
      
      if (localSaved) {
        toast.info('You are currently offline. Site will be created when you reconnect.', {
          duration: 5000,
        });
        
        // Return a temporary site with a local ID
        const tempSite: Site = {
          id: `temp-${Date.now()}`,
          name: siteData.name || 'New Site',
          location: siteData.location || 'Unknown',
          timezone: siteData.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
          lat: siteData.lat !== undefined ? siteData.lat : null,
          lng: siteData.lng !== undefined ? siteData.lng : null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        
        setIsLoading(false);
        return tempSite;
      } else {
        setError(new Error('Failed to save site data locally while offline'));
        toast.error('Failed to save site data locally. Please try again when online.');
        setIsLoading(false);
        return null;
      }
    }
    
    try {
      // Use retry logic for network operations
      const result = await retryWithBackoff(
        () => createSite(siteData),
        3,  // max 3 retries
        1000 // starting with 1s delay, then exponential backoff
      );
      
      if (result) {
        await refreshSites();
        queryClient.invalidateQueries({ queryKey: ['sites'] });
        return result;
      } else {
        throw new Error('Failed to create site');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(new Error(errorMessage));
      
      // If it's a network error, offer to save locally
      if (isNetworkError(err)) {
        const localSaved = saveToLocalStorage('create', siteData);
        if (localSaved) {
          toast.error(`Network error: ${errorMessage}. Site will be created when you reconnect.`, {
            duration: 5000,
          });
        } else {
          toast.error(`Failed to create site: ${errorMessage}`);
        }
      } else {
        toast.error(`Failed to create site: ${errorMessage}`);
      }
      
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [isOnline, queryClient, refreshSites, saveToLocalStorage]);

  const handleUpdate = useCallback(async (id: string, siteData: Partial<Site>): Promise<Site | null> => {
    setIsLoading(true);
    setError(null);
    
    // Check if we're online first
    if (!isOnline) {
      const localSaved = saveToLocalStorage('update', { id, ...siteData });
      
      if (localSaved) {
        toast.info('You are currently offline. Site will be updated when you reconnect.', {
          duration: 5000,
        });
        
        setIsLoading(false);
        // Return a merged site with the updates applied
        return {
          id,
          ...siteData,
          updated_at: new Date().toISOString(),
        } as Site;
      } else {
        setError(new Error('Failed to save site updates locally while offline'));
        toast.error('Failed to save site updates locally. Please try again when online.');
        setIsLoading(false);
        return null;
      }
    }
    
    try {
      // Use retry logic for network operations
      const result = await retryWithBackoff(
        () => updateSite(id, siteData),
        3,  // max 3 retries
        1000 // starting with 1s delay, then exponential backoff
      );
      
      if (result) {
        await refreshSites();
        queryClient.invalidateQueries({ queryKey: ['sites'] });
        queryClient.invalidateQueries({ queryKey: ['site', id] });
        return result;
      } else {
        throw new Error('Failed to update site');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(new Error(errorMessage));
      
      // If it's a network error, offer to save locally
      if (isNetworkError(err)) {
        const localSaved = saveToLocalStorage('update', { id, ...siteData });
        if (localSaved) {
          toast.error(`Network error: ${errorMessage}. Site will be updated when you reconnect.`, {
            duration: 5000,
          });
        } else {
          toast.error(`Failed to update site: ${errorMessage}`);
        }
      } else {
        toast.error(`Failed to update site: ${errorMessage}`);
      }
      
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [isOnline, queryClient, refreshSites, saveToLocalStorage]);

  const handleDelete = useCallback(async (id: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    // Check if we're online first
    if (!isOnline) {
      const localSaved = saveToLocalStorage('delete', { id });
      
      if (localSaved) {
        toast.info('You are currently offline. Site will be deleted when you reconnect.', {
          duration: 5000,
        });
        
        setIsLoading(false);
        return true;
      } else {
        setError(new Error('Failed to save delete operation locally while offline'));
        toast.error('Failed to save delete operation locally. Please try again when online.');
        setIsLoading(false);
        return false;
      }
    }
    
    try {
      // Use retry logic for network operations
      const result = await retryWithBackoff(
        () => deleteSite(id),
        3,  // max 3 retries
        1000 // starting with 1s delay, then exponential backoff
      );
      
      if (result) {
        await refreshSites();
        queryClient.invalidateQueries({ queryKey: ['sites'] });
        return true;
      } else {
        throw new Error('Failed to delete site');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(new Error(errorMessage));
      
      // If it's a network error, offer to save locally
      if (isNetworkError(err)) {
        const localSaved = saveToLocalStorage('delete', { id });
        if (localSaved) {
          toast.error(`Network error: ${errorMessage}. Site will be deleted when you reconnect.`, {
            duration: 5000,
          });
        } else {
          toast.error(`Failed to delete site: ${errorMessage}`);
        }
      } else {
        toast.error(`Failed to delete site: ${errorMessage}`);
      }
      
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [isOnline, queryClient, refreshSites, saveToLocalStorage]);
  
  // Process pending operations when reconnecting
  const processPendingOperations = useCallback(async () => {
    if (!isOnline) return;
    
    try {
      const pendingOperations = JSON.parse(localStorage.getItem('pendingSiteOperations') || '[]');
      if (pendingOperations.length === 0) return;
      
      setIsLoading(true);
      toast.info(`Processing ${pendingOperations.length} pending operations...`);
      
      let successCount = 0;
      let failCount = 0;
      
      for (const op of pendingOperations) {
        try {
          if (op.key === 'create') {
            await createSite(op.data);
            successCount++;
          } else if (op.key === 'update') {
            await updateSite(op.data.id, op.data);
            successCount++;
          } else if (op.key === 'delete') {
            await deleteSite(op.data.id);
            successCount++;
          }
        } catch (error) {
          console.error('Failed to process pending operation:', error);
          failCount++;
        }
      }
      
      // Clear processed operations
      localStorage.removeItem('pendingSiteOperations');
      
      // Refresh data
      await refreshSites();
      queryClient.invalidateQueries({ queryKey: ['sites'] });
      
      if (successCount > 0) {
        toast.success(`Successfully processed ${successCount} pending operations`);
      }
      
      if (failCount > 0) {
        toast.error(`Failed to process ${failCount} pending operations`);
      }
    } catch (error) {
      console.error('Error processing pending operations:', error);
      toast.error('Failed to process pending operations');
    } finally {
      setIsLoading(false);
    }
  }, [isOnline, queryClient, refreshSites]);
  
  // Set up a listener to process pending operations when coming back online
  useEffect(() => {
    if (isOnline) {
      processPendingOperations();
    }
  }, [isOnline, processPendingOperations]);

  return {
    createSite: handleCreate,
    updateSite: handleUpdate,
    deleteSite: handleDelete,
    processPendingOperations,
    isLoading,
    error
  };
}

// Ensure we properly import useEffect for the online status watcher
import { useEffect } from 'react';
