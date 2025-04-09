
import { toast } from 'sonner';
import { getSites, createSite, getOrCreateDummySite } from '../../sites/siteService';
import { SiteFormData } from '@/types/site';

// Get all available sites or create a default one if none exist
export async function getAvailableSites() {
  try {
    const sites = await getSites();
    
    if (sites && sites.length > 0) {
      return sites;
    }
    
    // Create a default site if no sites exist
    const defaultSite = await getOrCreateDummySite();
    return [defaultSite];
  } catch (error) {
    console.error('Error fetching available sites:', error);
    toast.error('Failed to fetch sites');
    return [];
  }
}

// Create a new site for a device if needed
export async function createSiteForDevice(siteData: SiteFormData) {
  try {
    return await createSite(siteData);
  } catch (error) {
    console.error('Error creating site for device:', error);
    toast.error('Failed to create site');
    return null;
  }
}
