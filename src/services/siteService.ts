
import { supabase } from "@/integrations/supabase/client";
import { Site } from "@/types/energy";
import { toast } from "sonner";

/**
 * Get all sites
 */
export const getAllSites = async (): Promise<Site[]> => {
  try {
    const { data, error } = await supabase
      .from('sites')
      .select('*')
      .order('name');
    
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
export const getSiteDevices = async (siteId: string): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .from('devices')
      .select('*')
      .eq('site_id', siteId);
    
    if (error) throw error;
    return data || [];
    
  } catch (error) {
    console.error(`Error fetching devices for site ${siteId}:`, error);
    toast.error("Failed to fetch site devices");
    return [];
  }
};

/**
 * Grant a user access to a site
 */
export const grantUserSiteAccess = async (userId: string, siteId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('user_site_access')
      .insert([{ user_id: userId, site_id: siteId }]);
    
    if (error) throw error;
    
    toast.success("User access granted");
    return true;
    
  } catch (error) {
    console.error(`Error granting user ${userId} access to site ${siteId}:`, error);
    toast.error("Failed to grant access");
    return false;
  }
};

/**
 * Revoke a user's access to a site
 */
export const revokeUserSiteAccess = async (userId: string, siteId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('user_site_access')
      .delete()
      .match({ user_id: userId, site_id: siteId });
    
    if (error) throw error;
    
    toast.success("User access revoked");
    return true;
    
  } catch (error) {
    console.error(`Error revoking user ${userId} access to site ${siteId}:`, error);
    toast.error("Failed to revoke access");
    return false;
  }
};
