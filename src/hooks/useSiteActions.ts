import { useState } from 'react';
import {
  createSite as createSiteService,
  getSites as getSitesService,
  getSiteById as getSiteByIdService,
  updateSite as updateSiteService,
  deleteSite as deleteSiteService,
} from '@/services/sites/siteService';
import { Site } from '@/types/site';

export const useSiteActions = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createSite = async (siteData: Omit<Site, 'id'>) => {
    setIsLoading(true);
    setError(null);
    try {
      const newSite = await createSiteService(siteData);
      return { success: true, data: newSite };
    } catch (err: any) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  const getSites = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const sites = await getSitesService();
      return { success: true, data: sites };
    } catch (err: any) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  const getSiteById = async (siteId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const site = await getSiteByIdService(siteId);
      return { success: true, data: site };
    } catch (err: any) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  const updateSite = async (siteId: string, siteData: Partial<Site>) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedSite = await updateSiteService(siteId, siteData);
      return { success: true, data: updatedSite };
    } catch (err: any) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  const deleteSite = async (siteId: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await deleteSiteService(siteId);
      // Check if the operation was successful without checking the void return
      return { success: true };
    } catch (err: any) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    createSite,
    getSites,
    getSiteById,
    updateSite,
    deleteSite,
  };
};
