import { supabase } from "@/integrations/supabase/client";
import { Site, createEmptySite } from "@/types/energy";
import { toast } from "sonner";

// Cache for site data to prevent excessive database calls
let siteCache: Site | null = null;
const FALLBACK_SITE_ID = "00000000-0000-0000-0000-000000000000";

/**
 * Clear the site cache (useful when site data changes)
 */
export const clearSiteCache = () => {
  siteCache = null;
};

/**
 * Get or create a site, with proper error handling and fallbacks
 */
export const getOrCreateDummySite = async (): Promise<Site> => {
  try {
    // Return cached site if available to reduce database calls
    if (siteCache) {
      return siteCache;
    }
    
    // First try to get any existing site
    const { data: existingSites, error: fetchError } = await supabase
      .from('sites')
      .select('*')
      .limit(1);
    
    if (fetchError) {
      // Handle database policy recursion error (common with RLS policies)
      if (fetchError.code === '42P17' || fetchError.message.includes('recursion')) {
        console.warn("Database policy recursion detected, using direct query method");
        return await getFallbackSite();
      }
      
      console.error("Error fetching sites:", fetchError);
      throw fetchError;
    }
    
    // If we have a site, cache and return it
    if (existingSites && existingSites.length > 0) {
      siteCache = existingSites[0] as Site;
      return siteCache;
    }
    
    // Otherwise, create a new dummy site
    const newSite = await createDummySite();
    if (newSite) {
      siteCache = newSite;
      return newSite;
    }
    
    // If all else fails, return a client-side fallback
    return createLocalFallbackSite();
    
  } catch (error) {
    console.error("Error in getOrCreateDummySite:", error);
    
    // Try fallback mechanism for specific error cases
    try {
      const fallbackSite = await getFallbackSite();
      return fallbackSite;
    } catch (fallbackError) {
      console.error("Fallback site mechanism also failed:", fallbackError);
      // Return a client-side generated fallback as last resort
      return createLocalFallbackSite();
    }
  }
};

/**
 * Try an alternative method to get site data
 * This function uses a different query approach to avoid recursion issues
 */
const getFallbackSite = async (): Promise<Site> => {
  try {
    // Try a simple RPC function call instead of direct table access
    const { data, error } = await supabase.rpc('get_default_site_id');
    
    if (!error && data) {
      // If we got an ID, fetch the complete site
      const { data: siteData, error: siteError } = await supabase
        .from('sites')
        .select('*')
        .eq('id', data)
        .maybeSingle();
      
      if (!siteError && siteData) {
        siteCache = siteData as Site;
        return siteData as Site;
      }
    }
    
    // If RPC method failed, create a new site
    return await createDummySite();
  } catch (error) {
    console.error("Error in fallback site fetch:", error);
    return createLocalFallbackSite();
  }
};

/**
 * Create a local fallback site object without database interaction
 * This is used as a last resort when all database methods fail
 */
const createLocalFallbackSite = (): Site => {
  const fallbackSite = {
    id: FALLBACK_SITE_ID,
    name: "Fallback Site",
    location: "Local",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  siteCache = fallbackSite;
  return fallbackSite;
};

/**
 * Create a dummy site for testing when no real site exists
 */
export const createDummySite = async (): Promise<Site | null> => {
  try {
    const defaultSite = createEmptySite();
    
    const { data, error } = await supabase
      .from('sites')
      .insert([defaultSite])
      .select()
      .single();
    
    if (error) {
      console.error("Error creating dummy site:", error);
      throw error;
    }
    
    if (!data) {
      throw new Error("No data returned from site creation");
    }
    
    // Cache the created site
    siteCache = data as Site;
    return data as Site;
    
  } catch (error) {
    console.error("Error creating dummy site:", error);
    return null;
  }
};
