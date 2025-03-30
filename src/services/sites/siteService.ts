
import axios from 'axios';
import { Site } from '@/types/site';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { mockSites } from './mockSites';
import { isNetworkError } from '@/utils/errorUtils';

// Helper to handle API errors
const handleApiError = (error: any, operation: string): null => {
  console.error(`Error ${operation}:`, error);
  
  // Check for specific types of errors
  if (isNetworkError(error)) {
    const errorMessage = error?.message || 'Network connectivity issue';
    toast.error(`Failed to ${operation}: ${errorMessage}. Please check your connection.`);
  } else {
    const errorMessage = error?.response?.data?.message || error?.message || 'Unknown error';
    toast.error(`Failed to ${operation}: ${errorMessage}`);
  }
  
  return null;
};

// Get sites from local storage cache
const getLocalSitesCache = (): Site[] | null => {
  try {
    const cachedData = localStorage.getItem('sitesCache');
    if (cachedData) {
      const { data, timestamp } = JSON.parse(cachedData);
      
      // Check if cache is still valid (less than 1 hour old)
      const cacheAge = Date.now() - new Date(timestamp).getTime();
      if (cacheAge < 3600000) {
        console.log('Using sites from local cache');
        return data as Site[];
      }
    }
    return null;
  } catch (error) {
    console.warn('Failed to read from local cache:', error);
    return null;
  }
};

// Update the local storage cache
const updateLocalSitesCache = (sites: Site[]): void => {
  try {
    localStorage.setItem('sitesCache', JSON.stringify({
      data: sites,
      timestamp: new Date().toISOString()
    }));
  } catch (error) {
    console.warn('Failed to update local cache:', error);
  }
};

export const getSites = async (): Promise<Site[]> => {
  try {
    // First try to get from Supabase
    const { data, error } = await supabase
      .from('sites')
      .select('*');
    
    if (error) {
      throw error;
    }
    
    if (data?.length) {
      // Update local cache
      updateLocalSitesCache(data as Site[]);
      return data as Site[];
    }
    
    // If no data from Supabase, try API
    try {
      const response = await axios.get('/api/sites');
      const apiData = response.data;
      
      // Update local cache
      updateLocalSitesCache(apiData);
      
      return apiData;
    } catch (apiError) {
      console.warn('API fetch failed, checking cache:', apiError);
      
      // Try to get from local cache
      const cachedSites = getLocalSitesCache();
      if (cachedSites?.length) {
        toast.warning('Using cached site data. Some information may be outdated.');
        return cachedSites;
      }
      
      console.warn('No cache available, using mock data:', apiError);
      // Return mock sites as last resort
      return mockSites;
    }
  } catch (error) {
    console.warn('Supabase fetch failed, trying API:', error);
    
    // Try API as fallback
    try {
      const response = await axios.get('/api/sites');
      const apiData = response.data;
      
      // Update local cache
      updateLocalSitesCache(apiData);
      
      return apiData;
    } catch (apiError) {
      console.warn('API fetch failed, checking cache:', apiError);
      
      // Try to get from local cache
      const cachedSites = getLocalSitesCache();
      if (cachedSites?.length) {
        toast.warning('Using cached site data. Some information may be outdated.');
        return cachedSites;
      }
      
      console.warn('No cache available, using mock data:', apiError);
      // Return mock sites as last resort
      return mockSites;
    }
  }
};

export const getSiteById = async (siteId: string): Promise<Site | null> => {
  // If it's a temporary site ID, check local storage for pending operations
  if (siteId.startsWith('temp-')) {
    try {
      const pendingOperations = JSON.parse(localStorage.getItem('pendingSiteOperations') || '[]');
      const operation = pendingOperations.find(op => op.data.id === siteId);
      
      if (operation) {
        return operation.data as Site;
      }
    } catch (error) {
      console.warn('Failed to retrieve temporary site from local storage:', error);
    }
  }

  try {
    // Try Supabase first
    const { data, error } = await supabase
      .from('sites')
      .select('*')
      .eq('id', siteId)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        // No data found, not an actual error
        // Try to get from local cache
        const cachedSites = getLocalSitesCache();
        if (cachedSites) {
          const cachedSite = cachedSites.find(site => site.id === siteId);
          if (cachedSite) {
            return cachedSite;
          }
        }
        
        // If not in cache, check mock data
        const mockSite = mockSites.find(site => site.id === siteId);
        return mockSite || null;
      }
      throw error;
    }
    
    return data as Site;
  } catch (error) {
    console.warn('Supabase fetch failed, trying API:', error);
    
    // Try API as fallback
    try {
      const response = await axios.get(`/api/sites/${siteId}`);
      return response.data;
    } catch (apiError) {
      console.warn('API fetch failed, checking cache:', apiError);
      
      // Try to get from local cache
      const cachedSites = getLocalSitesCache();
      if (cachedSites) {
        const cachedSite = cachedSites.find(site => site.id === siteId);
        if (cachedSite) {
          return cachedSite;
        }
      }
      
      console.warn('No cache available, checking mock data:', apiError);
      // Check mock data as last resort
      const site = mockSites.find(site => site.id === siteId);
      return site || null;
    }
  }
};

export const createSite = async (siteData: Partial<Site>): Promise<Site | null> => {
  // Prepare complete site data with defaults for any missing fields
  const completeData = {
    name: siteData.name || 'New Site',
    location: siteData.location || 'Unknown',
    timezone: siteData.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
    lat: siteData.lat !== undefined ? siteData.lat : null,
    lng: siteData.lng !== undefined ? siteData.lng : null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  try {
    // Try Supabase first
    const { data, error } = await supabase
      .from('sites')
      .insert([completeData])
      .select()
      .single();
    
    if (error) throw error;
    
    // Update local cache after successful creation
    const sites = await getSites();
    updateLocalSitesCache(sites);
    
    toast.success('Site created successfully');
    return data as Site;
  } catch (supabaseError) {
    console.warn('Supabase create failed, trying API:', supabaseError);
    
    // Try API as fallback
    try {
      const response = await axios.post('/api/sites', completeData);
      
      // Update local cache after successful creation
      const sites = await getSites();
      updateLocalSitesCache(sites);
      
      toast.success('Site created successfully');
      return response.data;
    } catch (apiError) {
      // Specific handling for network errors
      if (isNetworkError(apiError)) {
        toast.error('Network error while creating site. Please check your connection and try again.');
      }
      return handleApiError(apiError, 'create site');
    }
  }
};

export const updateSite = async (id: string, siteData: Partial<Site>): Promise<Site | null> => {
  try {
    // Get existing site to avoid overwriting data
    const existingSite = await getSiteById(id);
    if (!existingSite) {
      toast.error(`Site with ID ${id} not found`);
      return null;
    }
    
    // Prepare update data
    const updateData = {
      ...siteData,
      updated_at: new Date().toISOString()
    };
    
    // Try Supabase first
    const { data, error } = await supabase
      .from('sites')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    // Update local cache after successful update
    const sites = await getSites();
    updateLocalSitesCache(sites);
    
    toast.success('Site updated successfully');
    return data as Site;
  } catch (supabaseError) {
    console.warn('Supabase update failed, trying API:', supabaseError);
    
    // Try API as fallback
    try {
      const response = await axios.put(`/api/sites/${id}`, siteData);
      
      // Update local cache after successful update
      const sites = await getSites();
      updateLocalSitesCache(sites);
      
      toast.success('Site updated successfully');
      return response.data;
    } catch (apiError) {
      // Specific handling for network errors
      if (isNetworkError(apiError)) {
        toast.error('Network error while updating site. Please check your connection and try again.');
      }
      return handleApiError(apiError, 'update site');
    }
  }
};

export const deleteSite = async (id: string): Promise<boolean> => {
  try {
    // Try Supabase first
    const { error } = await supabase
      .from('sites')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    // Update local cache after successful deletion
    const sites = await getSites();
    updateLocalSitesCache(sites);
    
    toast.success('Site deleted successfully');
    return true;
  } catch (supabaseError) {
    console.warn('Supabase delete failed, trying API:', supabaseError);
    
    // Try API as fallback
    try {
      await axios.delete(`/api/sites/${id}`);
      
      // Update local cache after successful deletion
      const sites = await getSites();
      updateLocalSitesCache(sites);
      
      toast.success('Site deleted successfully');
      return true;
    } catch (apiError) {
      // Specific handling for network errors
      if (isNetworkError(apiError)) {
        toast.error('Network error while deleting site. Please check your connection and try again.');
      }
      handleApiError(apiError, 'delete site');
      return false;
    }
  }
};

export const getOrCreateDummySite = async (): Promise<Site> => {
  // First try to get sites from any available source
  try {
    const sites = await getSites();
    
    if (sites.length > 0) {
      return sites[0];
    }
  } catch (error) {
    console.warn('Failed to get existing sites:', error);
  }
  
  // Create a dummy site if no sites exist
  try {
    const newSite = await createSite({
      name: 'Default Site',
      location: 'Default Location',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    });
    
    if (newSite) {
      return newSite;
    }
  } catch (error) {
    console.error('Failed to create default site:', error);
  }
  
  // If all else fails, return a mock site
  return {
    id: 'mock-default',
    name: 'Default Site',
    location: 'Default Location',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    lat: null,
    lng: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
};

// Fix dependency installation issues by updating the AnomalyFeed component to have better error handling
