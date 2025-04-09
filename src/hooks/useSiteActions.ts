import { useState, useCallback } from 'react';
import { Site } from '@/types/site';
import { toast } from 'sonner';
import { updateSite, deleteSite } from '@/services/sites/siteService';
import useConnectionStatus from '@/hooks/useConnectionStatus';

export const useSiteActions = (site: Site | null) => {
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const connection = useConnectionStatus({
    autoConnect: false,
    retryInterval: 5000
  });
  
  const saveSite = useCallback(async (data: Partial<Site>) => {
    if (!site) {
      setError('No site available to update.');
      return false;
    }
    
    setIsSaving(true);
    setError(null);
    
    try {
      const updatedSite = await updateSite(site.id, data);
      if (updatedSite) {
        toast.success("Site updated successfully");
        return true;
      } else {
        setError('Failed to update site.');
        toast.error("Failed to update site");
        return false;
      }
    } catch (err: any) {
      const message = err?.message || 'An unexpected error occurred.';
      setError(message);
      toast.error(`Error updating site: ${message}`);
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [site]);
  
  const removeSite = useCallback(async () => {
    if (!site) {
      setError('No site available to delete.');
      return false;
    }
    
    setIsDeleting(true);
    setError(null);
    
    try {
      const success = await deleteSite(site.id);
      if (success) {
        toast.success("Site deleted successfully");
        return true;
      } else {
        setError('Failed to delete site.');
        toast.error("Failed to delete site");
        return false;
      }
    } catch (err: any) {
      const message = err?.message || 'An unexpected error occurred.';
      setError(message);
      toast.error(`Error deleting site: ${message}`);
      return false;
    } finally {
      setIsDeleting(false);
    }
  }, [site]);
  
  return {
    isSaving,
    isDeleting,
    error,
    saveSite,
    removeSite,
    isOnline: connection.isOnline,
    connect: connection.connect,
    disconnect: connection.disconnect,
    retryConnection: connection.retryConnection
  };
};

export default useSiteActions;
