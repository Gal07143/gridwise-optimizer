import { supabase } from "@/integrations/supabase/client";
import { Site, createEmptySite } from "@/types/energy";
import { toast } from "sonner";

/**
 * Get all sites
 */
export const getAllSites = async (): Promise<Site[]> => {
  try {
    const { data, error } = await supabase
      .from('sites')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
    
  } catch (error) {
    console.error("Error fetching sites:", error);
    toast.error("Failed to fetch sites");
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
    return data || null;
    
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
    return data || null;
    
  } catch (error) {
    console.error("Error creating site:", error);
    toast.error("Failed to create site");
    return null;
  }
};

/**
 * Update an existing site
 */
export const updateSite = async (id: string, updates: Partial<Site>): Promise<Site | null> => {
  try {
    const { data, error } = await supabase
      .from('sites')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    toast.success("Site updated successfully");
    return data || null;
    
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
 * Get site statistics
 */
export const getSiteStatistics = async (siteId: string): Promise<{
  deviceCount: number;
  totalEnergyGenerated: number;
  totalEnergyConsumed: number;
}> => {
  try {
    // Fetch device count
    const { count: deviceCount, error: deviceError } = await supabase
      .from('devices')
      .select('id', { count: 'exact', head: true })
      .eq('site_id', siteId);
    
    if (deviceError) throw deviceError;
    
    // Dummy data for energy stats (replace with actual calculations)
    const totalEnergyGenerated = Math.random() * 1000;
    const totalEnergyConsumed = Math.random() * 800;
    
    return {
      deviceCount: deviceCount || 0,
      totalEnergyGenerated,
      totalEnergyConsumed,
    };
  } catch (error) {
    console.error(`Error fetching site statistics for site ${siteId}:`, error);
    return { deviceCount: 0, totalEnergyGenerated: 0, totalEnergyConsumed: 0 };
  }
};

/**
 * Get or create a dummy site for demo purposes
 */
export const getOrCreateDummySite = async (): Promise<Site | null> => {
  try {
    // Check if a dummy site already exists
    let { data: sites, error: selectError } = await supabase
      .from('sites')
      .select('*')
      .like('name', '%Default Site%')
      .limit(1);
    
    if (selectError) throw selectError;
    
    if (sites && sites.length > 0) {
      return sites[0];
    }
    
    // Create a new dummy site if one doesn't exist
    const newSite = createEmptySite();
    
    const { data: newSiteData, error: insertError } = await supabase
      .from('sites')
      .insert([newSite])
      .select()
      .single();
    
    if (insertError) throw insertError;
    
    toast.success("Default site created");
    return newSiteData;
    
  } catch (error) {
    console.error("Error getting or creating dummy site:", error);
    toast.error("Failed to initialize default site");
    return null;
  }
};

export const updateSiteUsers = async (siteId: string, userIds: string[]): Promise<boolean> => {
  try {
    // Implementation will be added later as this functionality is developed
    console.log(`Updating users for site ${siteId} with users: ${userIds.join(', ')}`);
    return true;
  } catch (error) {
    console.error(`Error updating site users for site ${siteId}:`, error);
    toast.error("Failed to update site users");
    return false;
  }
};
