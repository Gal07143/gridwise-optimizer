
import { supabase } from '@/integrations/supabase/client';
import { Site, SiteFormData } from '@/types/site';

// Get all sites
export const getSites = async (): Promise<Site[]> => {
  try {
    const { data, error } = await supabase
      .from('sites')
      .select('*')
      .order('name');
      
    if (error) {
      throw error;
    }
    
    return data as Site[];
  } catch (error) {
    console.error('Error fetching sites:', error);
    throw error;
  }
};

// Get a site by ID
export const getSiteById = async (siteId: string): Promise<Site> => {
  try {
    const { data, error } = await supabase
      .from('sites')
      .select('*')
      .eq('id', siteId)
      .single();
      
    if (error) {
      throw error;
    }
    
    if (!data) {
      throw new Error('Site not found');
    }
    
    return data as Site;
  } catch (error) {
    console.error(`Error fetching site with ID ${siteId}:`, error);
    throw error;
  }
};

// Create a new site
export const createSite = async (site: SiteFormData): Promise<Site> => {
  try {
    // Add lat/lng with default values if not provided
    const siteWithDefaults = {
      ...site,
      lat: site.lat || 0,
      lng: site.lng || 0,
      timezone: site.timezone || 'UTC'
    };
    
    const { data, error } = await supabase
      .from('sites')
      .insert(siteWithDefaults)
      .select()
      .single();
      
    if (error) {
      throw error;
    }
    
    return data as Site;
  } catch (error) {
    console.error('Error creating site:', error);
    throw error;
  }
};

// Update an existing site
export const updateSite = async (siteId: string, site: Partial<Site>): Promise<Site> => {
  try {
    const { data, error } = await supabase
      .from('sites')
      .update(site)
      .eq('id', siteId)
      .select()
      .single();
      
    if (error) {
      throw error;
    }
    
    return data as Site;
  } catch (error) {
    console.error(`Error updating site with ID ${siteId}:`, error);
    throw error;
  }
};

// Delete a site
export const deleteSite = async (siteId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('sites')
      .delete()
      .eq('id', siteId);
      
    if (error) {
      throw error;
    }
  } catch (error) {
    console.error(`Error deleting site with ID ${siteId}:`, error);
    throw error;
  }
};
