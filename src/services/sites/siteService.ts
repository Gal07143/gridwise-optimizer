import { supabase } from '@/integrations/supabase/client';
import { Site, SiteFormData } from '@/types/site';
import { toast } from 'sonner';

/**
 * Get all sites from the database
 */
export const getSites = async (): Promise<Site[]> => {
  try {
    const { data, error } = await supabase
      .from('sites')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data as Site[];
    
  } catch (error) {
    console.error('Error fetching sites:', error);
    throw error;
  }
};

/**
 * Alias for getSites for backward compatibility
 */
export const getAllSites = getSites;

/**
 * Get a site by ID
 */
export const getSiteById = async (id: string): Promise<Site | null> => {
  try {
    const { data, error } = await supabase
      .from('sites')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data as Site;
    
  } catch (error) {
    console.error(`Error fetching site ${id}:`, error);
    return null;
  }
};

/**
 * Create a new site
 */
export const createSite = async (siteData: SiteFormData): Promise<Site | null> => {
  try {
    // Convert field names if needed
    const siteForDb: any = { ...siteData };
    
    // Map address to location if needed
    if (!siteForDb.location && siteForDb.address) {
      siteForDb.location = siteForDb.address;
    }
    
    // Map site_type to type if needed
    if (!siteForDb.type && siteForDb.site_type) {
      siteForDb.type = siteForDb.site_type;
    }
    
    const { data, error } = await supabase
      .from('sites')
      .insert([siteForDb])
      .select()
      .single();
    
    if (error) throw error;
    return data as Site;
    
  } catch (error) {
    console.error('Error creating site:', error);
    throw error;
  }
};

/**
 * Update an existing site
 */
export const updateSite = async (id: string, siteData: Partial<Site>): Promise<boolean> => {
  try {
    // Convert field names if needed
    const siteForDb: any = { ...siteData };
    
    // Map address to location if needed
    if (siteForDb.address && !siteForDb.location) {
      siteForDb.location = siteForDb.address;
    }
    
    // Map site_type to type if needed
    if (siteForDb.site_type && !siteForDb.type) {
      siteForDb.type = siteForDb.site_type;
    }
    
    const { error } = await supabase
      .from('sites')
      .update(siteForDb)
      .eq('id', id);
    
    if (error) throw error;
    return true;
    
  } catch (error) {
    console.error(`Error updating site ${id}:`, error);
    throw error;
  }
};

/**
 * Delete a site
 */
export const deleteSite = async (id: string): Promise<boolean> => {
  try {
    // Check if site has devices
    const { data: devices, error: devicesError } = await supabase
      .from('devices')
      .select('id')
      .eq('site_id', id);
    
    if (devicesError) throw devicesError;
    
    if (devices && devices.length > 0) {
      toast.error(`Cannot delete site: ${devices.length} devices are still assigned to it`);
      return false;
    }
    
    const { error } = await supabase
      .from('sites')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
    
  } catch (error) {
    console.error(`Error deleting site ${id}:`, error);
    throw error;
  }
};

/**
 * Search sites by name
 */
export const searchSites = async (query: string): Promise<Site[]> => {
  try {
    if (!query) {
      return getSites();
    }
    
    const { data, error } = await supabase
      .from('sites')
      .select('*')
      .ilike('name', `%${query}%`)
      .order('name');
    
    if (error) throw error;
    return data as Site[];
    
  } catch (error) {
    console.error('Error searching sites:', error);
    throw error;
  }
};

/**
 * Get sites with filters
 */
export const getFilteredSites = async (
  filters: { status?: string; type?: string; }
): Promise<Site[]> => {
  try {
    let query = supabase.from('sites').select('*');
    
    if (filters.status) {
      query = query.eq('status', filters.status);
    }
    
    if (filters.type) {
      query = query.eq('type', filters.type);
    }
    
    const { data, error } = await query.order('name');
    
    if (error) throw error;
    return data as Site[];
    
  } catch (error) {
    console.error('Error fetching filtered sites:', error);
    throw error;
  }
};

/**
 * Convert a Site to a SiteFormData object
 */
export const siteToFormData = (site: Site): SiteFormData => {
  return {
    name: site.name,
    address: site.address || site.location || '',
    city: site.city || '',
    state: site.state || '',
    country: site.country || '',
    postal_code: site.postal_code || '',
    timezone: site.timezone || '',
    lat: site.lat,
    lng: site.lng,
    status: site.status,
    description: site.description || '',
    site_type: site.site_type || site.type || '',
    tags: site.tags || [],
    main_image_url: site.main_image_url || '',
    organization_id: site.organization_id || '',
  };
};

/**
 * Convert SiteFormData to a Site object
 */
export const formDataToSite = (formData: SiteFormData, existingSite?: Site): Partial<Site> => {
  const site: Partial<Site> = {
    ...formData,
    // Support legacy fields
    location: formData.address,
    type: formData.site_type,
  };
  
  return site;
};

// Add a mock implementation for testing
export const getMockSites = (): Site[] => {
  return [
    {
      id: '1',
      name: 'Headquarters',
      address: '123 Main St',
      city: 'San Francisco',
      state: 'CA',
      country: 'USA',
      postal_code: '94105',
      location: '123 Main St, San Francisco, CA',
      timezone: 'America/Los_Angeles',
      lat: 37.7749,
      lng: -122.4194,
      type: 'Commercial',
      site_type: 'Commercial',
      status: 'active',
      description: 'Main office building',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '2',
      name: 'Manufacturing Plant',
      address: '456 Industry Ave',
      city: 'Detroit',
      state: 'MI',
      country: 'USA',
      postal_code: '48202',
      location: '456 Industry Ave, Detroit, MI',
      timezone: 'America/Detroit',
      lat: 42.3314,
      lng: -83.0458,
      type: 'Industrial',
      site_type: 'Industrial',
      status: 'active',
      description: 'Main manufacturing facility',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '3',
      name: 'Data Center',
      address: '789 Server Rd',
      city: 'Austin',
      state: 'TX',
      country: 'USA',
      postal_code: '73301',
      location: '789 Server Rd, Austin, TX',
      timezone: 'America/Chicago',
      lat: 30.2672,
      lng: -97.7431,
      type: 'Data Center',
      site_type: 'Data Center',
      status: 'active',
      description: 'Primary data center',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
  ];
};
