import { supabase } from '@/integrations/supabase/client';
import { Site, SiteFormData } from '@/types/site';
import { toast } from 'sonner';
import { crypto } from 'crypto';

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
    
    // Map any legacy fields if needed
    return (data as Site[]).map(site => ({
      ...site,
      // Ensure backward compatibility
      location: site.address || site.location,
      type: site.site_type || site.type
    }));
    
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
    
    // Add backward compatibility fields
    return {
      ...data as Site,
      location: data.address || data.location,
      type: data.site_type || data.type
    };
    
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
    // Convert field names to match the database schema
    const siteForDb: any = { ...siteData };
    
    // Map location to address if address is not provided
    if (!siteForDb.address && siteForDb.location) {
      siteForDb.address = siteForDb.location;
      // Don't include location field as it's not in the table schema
      delete siteForDb.location;
    }
    
    // Map type to site_type if site_type is not provided
    if (!siteForDb.site_type && siteForDb.type) {
      siteForDb.site_type = siteForDb.type;
      // Don't include type field as it's not in the table schema
      delete siteForDb.type;
    }
    
    const { data, error } = await supabase
      .from('sites')
      .insert([siteForDb])
      .select()
      .single();
    
    if (error) throw error;
    
    // Return with backward compatibility fields
    return {
      ...data as Site,
      location: data.address,
      type: data.site_type
    };
    
  } catch (error) {
    console.error('Error creating site:', error);
    throw error;
  }
};

/**
 * Create a new site from form data
 */
export const createSiteFromFormData = (data: SiteFormData): Site => {
  return {
    id: crypto.randomUUID(),
    name: data.name,
    location: data.location,
    timezone: data.timezone,
    lat: data.lat,
    lng: data.lng,
    status: data.status || 'active',
    type: data.type,
    description: data.description,
    city: data.city,
    state: data.state,
    country: data.country,
    address: data.address,
    postal_code: data.postal_code,
    site_type: data.site_type,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    contact_person: data.contact_person,
    contact_email: data.contact_email,
    contact_phone: data.contact_phone,
    main_image_url: data.main_image_url,
    tags: data.tags || []
  };
};

/**
 * Update an existing site
 */
export const updateSite = async (id: string, siteData: Partial<Site>): Promise<boolean> => {
  try {
    // Convert field names to match the database schema
    const siteForDb: any = { ...siteData };
    
    // Map location to address if provided
    if (siteData.location && !siteData.address) {
      siteForDb.address = siteData.location;
      delete siteForDb.location; // Remove location as it's not in the schema
    }
    
    // Map type to site_type if provided
    if (siteData.type && !siteData.site_type) {
      siteForDb.site_type = siteData.type;
      delete siteForDb.type; // Remove type as it's not in the schema
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
 * Create a dummy site if no sites exist
 * This is useful for development and demo purposes
 */
export const getOrCreateDummySite = async (): Promise<Site> => {
  try {
    // Check if any sites exist
    const { data: existingSites, error: sitesError } = await supabase
      .from('sites')
      .select('id')
      .limit(1);
      
    if (sitesError) throw sitesError;
    
    // If sites exist, return the first one
    if (existingSites && existingSites.length > 0) {
      const siteId = existingSites[0].id;
      const site = await getSiteById(siteId);
      
      if (!site) {
        throw new Error('Failed to retrieve existing site');
      }
      
      return site;
    }
    
    // Create a dummy site
    const dummySiteData: SiteFormData = {
      name: 'Default Site',
      address: '123 Main St, Demo City',
      city: 'Demo City',
      state: 'CA',
      country: 'USA',
      postal_code: '12345',
      timezone: 'America/Los_Angeles',
      lat: 37.7749,
      lng: -122.4194,
      status: 'active',
      description: 'Default demo site',
      site_type: 'Commercial',
    };
    
    const newSite = await createSite(dummySiteData);
    
    if (!newSite) {
      throw new Error('Failed to create dummy site');
    }
    
    return newSite;
  } catch (error) {
    console.error('Error in getOrCreateDummySite:', error);
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
    // Legacy fields for compatibility
    location: site.address || site.location || '',
    type: site.site_type || site.type || '',
    building_type: site.building_type || '',
    area: site.area || 0,
    contact_person: site.contact_person || '',
    contact_email: site.contact_email || '',
    contact_phone: site.contact_phone || '',
  };
};

/**
 * Convert SiteFormData to a Site object
 */
export const formDataToSite = (formData: SiteFormData, existingSite?: Site): Partial<Site> => {
  const site: Partial<Site> = {
    ...formData,
    // Support legacy fields
    address: formData.address || formData.location || '',
    site_type: formData.site_type || formData.type || '',
  };
  
  return site;
};
