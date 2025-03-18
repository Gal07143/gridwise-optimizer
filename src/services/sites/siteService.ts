import { supabase } from "@/integrations/supabase/client";
import { Site } from "@/types/energy";
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
    throw error;
  }
};

/**
 * Create a dummy site for testing when no real site exists
 */
export const createDummySite = async (): Promise<Site | null> => {
  try {
    const defaultSite = {
      name: "Default Site",
      location: "Default Location",
      timezone: "UTC",
      lat: 0,
      lng: 0
    };
    
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
    throw error;
  }
};
