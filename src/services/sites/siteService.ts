
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Site } from '@/types/site';

// Fetch all sites from the database
export const fetchSites = async (): Promise<Site[]> => {
  try {
    // Try to fetch from Supabase if connected
    try {
      const { data, error } = await supabase
        .from('sites')
        .select('*')
        .order('name');
        
      if (error) throw error;
      
      if (data && data.length > 0) {
        // Transform data to match our Site interface
        return data.map(site => ({
          ...site,
          location: site.lat && site.lng 
            ? { latitude: site.lat, longitude: site.lng } 
            : undefined
        }));
      }
    } catch (e) {
      console.warn('Supabase fetch failed, using mock data:', e);
    }
    
    // Fallback to mock data
    return [
      {
        id: '1',
        name: 'Main Solar Plant',
        address: '123 Energy St',
        city: 'Sunnyvale',
        state: 'CA',
        country: 'USA',
        zipCode: '94086',
        timezone: 'America/Los_Angeles',
        capacity: 500,
        location: { latitude: 37.368, longitude: -122.036 },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        description: 'Main solar power generation facility',
        area: 10000,
        building_type: 'Industrial',
        energy_category: ['solar', 'battery'],
        contact_person: 'John Doe',
        contact_phone: '555-123-4567',
        contact_email: 'john@example.com',
      },
      {
        id: '2',
        name: 'Wind Farm North',
        address: '456 Turbine Rd',
        city: 'Windy Hills',
        state: 'TX',
        country: 'USA',
        zipCode: '75001',
        timezone: 'America/Chicago',
        capacity: 750,
        location: { latitude: 32.77, longitude: -96.79 },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        description: 'Northern wind turbine farm',
        area: 25000,
        building_type: 'Wind Farm',
        energy_category: ['wind'],
        contact_person: 'Jane Smith',
        contact_phone: '555-987-6543',
        contact_email: 'jane@example.com',
      },
    ];
  } catch (err) {
    console.error('Error fetching sites:', err);
    throw err;
  }
};

// Get a specific site by ID
export const getSiteById = async (id: string): Promise<Site | null> => {
  try {
    // Try to fetch from Supabase
    try {
      const { data, error } = await supabase
        .from('sites')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      
      if (data) {
        return {
          ...data,
          location: data.lat && data.lng 
            ? { latitude: data.lat, longitude: data.lng } 
            : undefined
        };
      }
    } catch (e) {
      console.warn('Supabase fetch failed, using mock data:', e);
    }
    
    // Fallback to mock implementation
    const mockSites = await fetchSites();
    return mockSites.find(site => site.id === id) || null;
  } catch (err) {
    console.error(`Error fetching site with ID ${id}:`, err);
    throw err;
  }
};

// Add a new site to the database
export const addSiteToDb = async (siteData: Omit<Site, 'id' | 'created_at' | 'updated_at'>): Promise<Site | null> => {
  try {
    // Format data for database
    const dbData = {
      name: siteData.name,
      address: siteData.address,
      city: siteData.city,
      state: siteData.state,
      country: siteData.country,
      zip_code: siteData.zipCode,
      timezone: siteData.timezone || 'UTC',
      capacity: siteData.capacity,
      lat: siteData.location?.latitude || siteData.lat,
      lng: siteData.location?.longitude || siteData.lng,
      description: siteData.description,
      area: siteData.area,
      building_type: siteData.building_type,
      energy_category: siteData.energy_category,
      contact_person: siteData.contact_person,
      contact_phone: siteData.contact_phone,
      contact_email: siteData.contact_email,
      weather_station_id: siteData.weather_station_id,
      cost_center: siteData.cost_center,
      kpi_baseline: siteData.kpi_baseline,
      site_code: siteData.site_code,
      owner: siteData.owner,
      construction_year: siteData.construction_year,
      renovation_year: siteData.renovation_year,
      property_value: siteData.property_value,
      property_currency: siteData.property_currency,
      energy_certificates: siteData.energy_certificates,
      operating_hours: siteData.operating_hours,
      photo_url: siteData.photo_url,
      custom_fields: siteData.custom_fields,
    };

    // Try to add site to Supabase
    try {
      const { data, error } = await supabase
        .from('sites')
        .insert([dbData])
        .select();
        
      if (error) throw error;
      
      if (data && data.length > 0) {
        // Format the returned site data
        return {
          ...data[0],
          location: data[0].lat && data[0].lng 
            ? { latitude: data[0].lat, longitude: data[0].lng } 
            : undefined
        };
      }
    } catch (e) {
      console.warn('Supabase add failed, using mock implementation:', e);
    }
    
    // Fallback to mock implementation
    const newSite: Site = {
      id: `mock-${Date.now()}`,
      ...siteData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    return newSite;
  } catch (err) {
    console.error('Error adding site:', err);
    throw err;
  }
};

// Update an existing site in the database
export const updateSiteInDb = async (id: string, siteData: Partial<Site>): Promise<Site | null> => {
  try {
    // Format data for database
    const dbData: any = { ...siteData };
    
    // Handle nested location object
    if (siteData.location) {
      dbData.lat = siteData.location.latitude;
      dbData.lng = siteData.location.longitude;
      delete dbData.location;
    }
    
    // Try to update site in Supabase
    try {
      const { data, error } = await supabase
        .from('sites')
        .update(dbData)
        .eq('id', id)
        .select();
        
      if (error) throw error;
      
      if (data && data.length > 0) {
        // Format the returned site data
        return {
          ...data[0],
          location: data[0].lat && data[0].lng 
            ? { latitude: data[0].lat, longitude: data[0].lng } 
            : undefined
        };
      }
    } catch (e) {
      console.warn('Supabase update failed, using mock implementation:', e);
    }
    
    // Fallback to mock implementation
    const sites = await fetchSites();
    const existingSite = sites.find(site => site.id === id);
    
    if (!existingSite) {
      return null;
    }
    
    const updatedSite: Site = {
      ...existingSite,
      ...siteData,
      updated_at: new Date().toISOString(),
    };
    
    return updatedSite;
  } catch (err) {
    console.error('Error updating site:', err);
    throw err;
  }
};

// Delete a site from the database
export const deleteSiteFromDb = async (id: string): Promise<boolean> => {
  try {
    // Try to delete site from Supabase
    try {
      const { error } = await supabase
        .from('sites')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      return true;
    } catch (e) {
      console.warn('Supabase delete failed, using mock implementation:', e);
    }
    
    // Mock deletion is always successful
    return true;
  } catch (err) {
    console.error('Error deleting site:', err);
    throw err;
  }
};

// Get all sites for the current user
export const getAllSites = async (): Promise<Site[]> => {
  return fetchSites();
};

// Create a new site
export const createSite = async (siteData: Omit<Site, 'id' | 'created_at' | 'updated_at'>): Promise<Site | null> => {
  return addSiteToDb(siteData);
};

// Update a site
export const updateSite = async (id: string, siteData: Partial<Site>): Promise<Site | null> => {
  return updateSiteInDb(id, siteData);
};

// Delete a site
export const deleteSite = async (id: string): Promise<boolean> => {
  return deleteSiteFromDb(id);
};
