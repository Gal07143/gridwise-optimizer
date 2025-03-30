
import { useState } from 'react';
import { Site } from '@/types/site';
import { createSite, updateSite, deleteSite } from '@/services/sites/siteService';
import { toast } from 'sonner';
import { useSiteContext } from '@/contexts/SiteContext';
import { useQueryClient } from '@tanstack/react-query';

export function useSiteActions() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { refreshSites } = useSiteContext();
  const queryClient = useQueryClient();

  const handleCreate = async (siteData: Partial<Site>): Promise<Site | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await createSite(siteData);
      
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
      toast.error(`Failed to create site: ${errorMessage}`);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (id: string, siteData: Partial<Site>): Promise<Site | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await updateSite(id, siteData);
      
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
      toast.error(`Failed to update site: ${errorMessage}`);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await deleteSite(id);
      
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
      toast.error(`Failed to delete site: ${errorMessage}`);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createSite: handleCreate,
    updateSite: handleUpdate,
    deleteSite: handleDelete,
    isLoading,
    error
  };
}
