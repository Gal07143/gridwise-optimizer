
import { supabase } from "@/integrations/supabase/client";
import { Site, createEmptySite } from "@/types/energy";
import { toast } from "sonner";

/**
 * Get or create a dummy site if none exists
 */
export const getOrCreateDummySite = async (): Promise<Site | null> => {
  try {
    // First try to get any existing site
    const { data: existingSites, error: fetchError } = await supabase
      .from('sites')
      .select('*')
      .limit(1);
    
    if (fetchError) {
      console.error("Error fetching sites:", fetchError);
      throw fetchError;
    }
    
    // If we have a site, return it
    if (existingSites && existingSites.length > 0) {
      return existingSites[0] as Site;
    }
    
    // Otherwise, create a new dummy site
    return await createDummySite();
    
  } catch (error) {
    console.error("Error in getOrCreateDummySite:", error);
    
    // Return a client-side fallback site with a predefined ID
    // This prevents continuous retries that might trigger recursion
    return {
      id: "00000000-0000-0000-0000-000000000000",
      name: "Fallback Site",
      location: "Local",
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  }
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
    
    return data as Site;
    
  } catch (error) {
    console.error("Error creating dummy site:", error);
    
    // Return a client-side fallback site
    return {
      id: "00000000-0000-0000-0000-000000000000",
      name: "Fallback Site",
      location: "Local",
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  }
};
