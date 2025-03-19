
import { supabase } from "@/integrations/supabase/client";
import { getOrCreateDummySite } from "../../sites/siteService";

/**
 * Get a valid site ID, with fallbacks if needed
 */
export const getValidSiteId = async (providedSiteId?: string): Promise<string> => {
  // If site ID is provided, use it
  if (providedSiteId) {
    return providedSiteId;
  }
  
  try {
    // Try to get a site with a direct query to avoid RLS issues
    const { data: sites, error } = await supabase
      .from('sites')
      .select('id')
      .limit(1);
    
    if (!error && sites && sites.length > 0) {
      return sites[0].id;
    }
  } catch (siteError) {
    console.error("Error getting site ID via direct query:", siteError);
    // Continue with fallback mechanisms
  }
  
  // Try to get or create a site using the site service
  try {
    const site = await getOrCreateDummySite();
    if (site && site.id) {
      return site.id;
    }
  } catch (siteError) {
    console.error("Error getting site via service:", siteError);
    // Continue with final fallback
  }
  
  // Final fallback - use dummy ID
  return "00000000-0000-0000-0000-000000000000";
};

/**
 * Get the current authenticated user ID or throw error if not authenticated
 */
export const getAuthenticatedUserId = async (): Promise<string> => {
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData?.user?.id;
  
  if (!userId) {
    throw new Error("Authentication required");
  }
  
  return userId;
};
