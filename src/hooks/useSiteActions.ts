
import { useState } from 'react';
import {
  createSite as createSiteService,
  getSites as getSitesService,
  getSiteById as getSiteByIdService,
  updateSite as updateSiteService,
  deleteSite as deleteSiteService,
} from '@/services/sites/siteService';
import { Site } from '@/types/site';

interface ActionResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export const useSiteActions = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createSite = async (siteData: Omit<Site, 'id'>): Promise<ActionResult<Site>> => {
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

  const getSites = async (): Promise<ActionResult<Site[]>> => {
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

  const getSiteById = async (siteId: string): Promise<ActionResult<Site>> => {
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

  const updateSite = async (siteId: string, siteData: Partial<Site>): Promise<ActionResult<Site>> => {
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

  const deleteSite = async (siteId: string): Promise<ActionResult> => {
    setIsLoading(true);
    setError(null);
    
    try {
      await deleteSiteService(siteId);
      // Since deleteSiteService returns void, we explicitly return a success object
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
