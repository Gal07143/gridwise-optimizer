
import { supabase } from "@/integrations/supabase/client";
import { Site } from "@/types/energy";
import { toast } from "sonner";

/**
 * Get all sites with optional pagination
 */
export const getAllSites = async (
  page = 0, 
  pageSize = 100,
  orderBy = 'name',
  ascending = true
): Promise<Site[]> => {
  try {
    let query = supabase
      .from('sites')
      .select('*')
      .order(orderBy, { ascending });
    
    // Apply pagination if specified
    if (pageSize > 0) {
      const start = page * pageSize;
      const end = start + pageSize - 1;
      query = query.range(start, end);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    return data || [];
    
  } catch (error) {
    console.error("Error fetching sites:", error);
    toast.error("Failed to fetch sites");
    return [];
  }
};

/**
 * Search sites by name or location
 */
export const searchSites = async (searchTerm: string): Promise<Site[]> => {
  try {
    const { data, error } = await supabase
      .from('sites')
      .select('*')
      .or(`name.ilike.%${searchTerm}%,location.ilike.%${searchTerm}%`)
      .order('name');
    
    if (error) throw error;
    return data || [];
    
  } catch (error) {
    console.error(`Error searching sites with term "${searchTerm}":`, error);
    toast.error("Failed to search sites");
    return [];
  }
};

/**
 * Get a single site by ID
 */
export const getSiteById = async (id: string): Promise<Site | null> => {
  try {
    const { data, error } = await supabase
      .from('sites')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
    
  } catch (error) {
    console.error(`Error fetching site ${id}:`, error);
    toast.error("Failed to fetch site details");
    return null;
  }
};

/**
 * Create a new site
 */
export const createSite = async (site: Omit<Site, 'id' | 'created_at' | 'updated_at'>): Promise<Site | null> => {
  try {
    const { data, error } = await supabase
      .from('sites')
      .insert([site])
      .select()
      .single();
    
    if (error) throw error;
    
    toast.success("Site created successfully");
    return data;
    
  } catch (error) {
    console.error("Error creating site:", error);
    toast.error("Failed to create site");
    return null;
  }
};

/**
 * Update a site
 */
export const updateSite = async (id: string, updates: Partial<Site>): Promise<Site | null> => {
  try {
    // Remove fields that shouldn't be updated directly
    const { id: _id, created_at, updated_at, ...updateData } = updates as any;
    
    const { data, error } = await supabase
      .from('sites')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    toast.success("Site updated successfully");
    return data;
    
  } catch (error) {
    console.error(`Error updating site ${id}:`, error);
    toast.error("Failed to update site");
    return null;
  }
};

/**
 * Delete a site
 */
export const deleteSite = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('sites')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    toast.success("Site deleted successfully");
    return true;
    
  } catch (error) {
    console.error(`Error deleting site ${id}:`, error);
    toast.error("Failed to delete site");
    return false;
  }
};

/**
 * Get devices for a site
 */
export const getSiteDevices = async (
  siteId: string, 
  page = 0, 
  pageSize = 50,
  filters?: { status?: string, type?: string }
): Promise<any[]> => {
  try {
    let query = supabase
      .from('devices')
      .select('*')
      .eq('site_id', siteId);
    
    // Apply filters if provided
    if (filters?.status) {
      query = query.eq('status', filters.status);
    }
    
    if (filters?.type) {
      query = query.eq('type', filters.type);
    }
    
    // Apply pagination
    if (pageSize > 0) {
      const start = page * pageSize;
      const end = start + pageSize - 1;
      query = query.range(start, end);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    return data || [];
    
  } catch (error) {
    console.error(`Error fetching devices for site ${siteId}:`, error);
    toast.error("Failed to fetch site devices");
    return [];
  }
};

/**
 * Get site statistics (device counts, status, etc.)
 */
export const getSiteStatistics = async (siteId: string): Promise<any> => {
  try {
    // Get all devices for the site
    const devices = await getSiteDevices(siteId, 0, 1000);
    
    // Calculate device statistics
    const stats = {
      totalDevices: devices.length,
      byType: {} as Record<string, number>,
      byStatus: {} as Record<string, number>,
      totalCapacity: 0,
    };
    
    // Count devices by type and status
    devices.forEach(device => {
      // Count by type
      if (!stats.byType[device.type]) {
        stats.byType[device.type] = 0;
      }
      stats.byType[device.type]++;
      
      // Count by status
      if (!stats.byStatus[device.status]) {
        stats.byStatus[device.status] = 0;
      }
      stats.byStatus[device.status]++;
      
      // Sum capacities
      if (device.capacity) {
        stats.totalCapacity += device.capacity;
      }
    });
    
    return stats;
    
  } catch (error) {
    console.error(`Error getting statistics for site ${siteId}:`, error);
    return null;
  }
};

// Export other functions from the original file
export {
  grantUserSiteAccess,
  revokeUserSiteAccess,
};
