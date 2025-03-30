
import axios from 'axios';
import { Site } from '@/types/site';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { mockSites } from './mockSites';

// Helper to handle API errors
const handleApiError = (error: any, operation: string): null => {
  console.error(`Error ${operation}:`, error);
  const errorMessage = error?.response?.data?.message || error?.message || 'Unknown error';
  toast.error(`Failed to ${operation}: ${errorMessage}`);
  return null;
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
      return data as Site[];
    }
    
    // If no data from Supabase, try API
    try {
      const response = await axios.get('/api/sites');
      return response.data;
    } catch (apiError) {
      console.warn('API fetch failed, using mock data:', apiError);
      // Return mock sites as last resort
      return mockSites;
    }
  } catch (error) {
    console.warn('Supabase fetch failed, trying API:', error);
    
    // Try API as fallback
    try {
      const response = await axios.get('/api/sites');
      return response.data;
    } catch (apiError) {
      console.warn('API fetch failed, using mock data:', apiError);
      // Return mock sites as last resort
      return mockSites;
    }
  }
};

export const getSiteById = async (siteId: string): Promise<Site | null> => {
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
      console.warn('API fetch failed, checking mock data:', apiError);
      // Check mock data as last resort
      const site = mockSites.find(site => site.id === siteId);
      return site || null;
    }
  }
};

export const createSite = async (siteData: Partial<Site>): Promise<Site | null> => {
  try {
    // Try Supabase first
    const { data, error } = await supabase
      .from('sites')
      .insert([{
        name: siteData.name || 'New Site',
        location: siteData.location || 'Unknown',
        timezone: siteData.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
        lat: siteData.lat !== undefined ? siteData.lat : null,
        lng: siteData.lng !== undefined ? siteData.lng : null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }])
      .select()
      .single();
    
    if (error) throw error;
    
    toast.success('Site created successfully');
    return data as Site;
  } catch (supabaseError) {
    console.warn('Supabase create failed, trying API:', supabaseError);
    
    // Try API as fallback
    try {
      const response = await axios.post('/api/sites', siteData);
      toast.success('Site created successfully');
      return response.data;
    } catch (apiError) {
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
    
    // Try Supabase first
    const { data, error } = await supabase
      .from('sites')
      .update({
        ...siteData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    toast.success('Site updated successfully');
    return data as Site;
  } catch (supabaseError) {
    console.warn('Supabase update failed, trying API:', supabaseError);
    
    // Try API as fallback
    try {
      const response = await axios.put(`/api/sites/${id}`, siteData);
      toast.success('Site updated successfully');
      return response.data;
    } catch (apiError) {
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
    
    toast.success('Site deleted successfully');
    return true;
  } catch (supabaseError) {
    console.warn('Supabase delete failed, trying API:', supabaseError);
    
    // Try API as fallback
    try {
      await axios.delete(`/api/sites/${id}`);
      toast.success('Site deleted successfully');
      return true;
    } catch (apiError) {
      handleApiError(apiError, 'delete site');
      return false;
    }
  }
};

export const getOrCreateDummySite = async (): Promise<Site> => {
  // Try to get the first site
  const sites = await getSites();
  
  if (sites.length > 0) {
    return sites[0];
  }
  
  // Create a dummy site if no sites exist
  const newSite = await createSite({
    name: 'Default Site',
    location: 'Default Location',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });
  
  if (newSite) {
    return newSite;
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
