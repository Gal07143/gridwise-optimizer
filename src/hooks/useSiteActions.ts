
import { useState } from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';
import { Site } from '@/types/site';
import { retryWithBackoff, isNetworkError } from '@/utils/errorUtils';

// API endpoint for sites
const SITES_ENDPOINT = '/api/sites';

export function useSiteActions() {
  const [isProcessing, setIsProcessing] = useState(false);
  const queryClient = useQueryClient();

  const retryOperation = async <T>(operation: () => Promise<T>): Promise<T> => {
    return retryWithBackoff(operation, 3, 1000);
  };

  // Create site mutation
  const createSite = useMutation({
    mutationFn: async (siteData: Omit<Site, 'id' | 'created_at' | 'updated_at'>) => {
      setIsProcessing(true);
      
      // Add timestamps for site creation
      const now = new Date().toISOString();
      const newSite = {
        ...siteData,
        created_at: now,
        updated_at: now
      };
      
      try {
        const response = await retryOperation(() => 
          axios.post<Site>(SITES_ENDPOINT, newSite)
        );
        return response.data;
      } finally {
        setIsProcessing(false);
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['sites'] });
      toast.success(`Site ${data.name} was created successfully`);
    },
    onError: (error) => {
      console.error('Failed to create site:', error);
      
      if (isNetworkError(error)) {
        toast.error('Network error. Please check your connection and try again.');
      } else {
        toast.error('Failed to create site. Please try again later.');
      }
    }
  });

  // Update site mutation
  const updateSite = useMutation({
    mutationFn: async (site: Site) => {
      setIsProcessing(true);
      
      // Update the updated_at timestamp
      const updatedSite = {
        ...site,
        updated_at: new Date().toISOString()
      };
      
      try {
        const response = await retryOperation(() => 
          axios.put<Site>(`${SITES_ENDPOINT}/${site.id}`, updatedSite)
        );
        return response.data;
      } finally {
        setIsProcessing(false);
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['sites'] });
      queryClient.invalidateQueries({ queryKey: ['site', data.id] });
      toast.success(`Site ${data.name} was updated successfully`);
    },
    onError: (error) => {
      console.error('Failed to update site:', error);
      
      if (isNetworkError(error)) {
        toast.error('Network error. Please check your connection and try again.');
      } else {
        toast.error('Failed to update site. Please try again later.');
      }
    }
  });

  // Delete site mutation
  const deleteSite = useMutation({
    mutationFn: async (siteId: string) => {
      setIsProcessing(true);
      
      try {
        await retryOperation(() => 
          axios.delete(`${SITES_ENDPOINT}/${siteId}`)
        );
        return siteId;
      } finally {
        setIsProcessing(false);
      }
    },
    onSuccess: (siteId) => {
      queryClient.invalidateQueries({ queryKey: ['sites'] });
      queryClient.removeQueries({ queryKey: ['site', siteId] });
      toast.success('Site was deleted successfully');
    },
    onError: (error) => {
      console.error('Failed to delete site:', error);
      
      if (isNetworkError(error)) {
        toast.error('Network error. Please check your connection and try again.');
      } else {
        toast.error('Failed to delete site. Please try again later.');
      }
    }
  });

  return {
    createSite,
    updateSite,
    deleteSite,
    isProcessing
  };
}

export default useSiteActions;
