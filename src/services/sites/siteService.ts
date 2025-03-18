
import { supabase } from "@/integrations/supabase/client";

/**
 * Create a dummy site directly
 */
export const createDummySite = async () => {
  try {
    const { data, error } = await supabase
      .from('sites')
      .insert([
        {
          name: 'Main Campus',
          location: 'San Francisco, CA',
          timezone: 'America/Los_Angeles',
          lat: 37.7749,
          lng: -122.4194
        }
      ])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error creating site:", error);
    return null;
  }
};

/**
 * Get or create a dummy site for testing
 */
export const getOrCreateDummySite = async () => {
  try {
    // Check if we have a site
    const { data: sites, error: sitesError } = await supabase
      .from('sites')
      .select('*')
      .limit(1);
    
    if (sitesError) throw sitesError;
    
    // If we have a site, return it
    if (sites && sites.length > 0) {
      return sites[0];
    }
    
    // Create a dummy site
    return await createDummySite();
    
  } catch (error) {
    console.error("Error with site setup:", error);
    return null;
  }
};
