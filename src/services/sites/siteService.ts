
import { Site } from '@/types/energy';
import { mockSites } from './mockSites';

export const getSites = async (): Promise<Site[]> => {
  // Return mock sites data
  return mockSites;
};

export const getSiteById = async (siteId: string): Promise<Site | null> => {
  const site = mockSites.find(site => site.id === siteId);
  return site || null;
};

export const createSite = async (siteData: Partial<Site>): Promise<Site> => {
  const newSite: Site = {
    id: `site-${Date.now()}`,
    name: siteData.name || 'New Site',
    location: siteData.location || 'Unknown',
    timezone: siteData.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
    lat: siteData.lat || null,
    lng: siteData.lng || null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  
  // In a real implementation, this would add to the database
  
  return newSite;
};

export const updateSite = async (id: string, siteData: Partial<Site>): Promise<Site> => {
  const site = await getSiteById(id);
  if (!site) {
    throw new Error(`Site with ID ${id} not found`);
  }
  
  const updatedSite: Site = {
    ...site,
    ...siteData,
    updated_at: new Date().toISOString(),
  };
  
  // In a real implementation, this would update the database
  
  return updatedSite;
};

export const deleteSite = async (id: string): Promise<boolean> => {
  // In a real implementation, this would delete from the database
  return true;
};

export const getOrCreateDummySite = async (): Promise<Site> => {
  // Try to get the first site
  const sites = await getSites();
  
  if (sites.length > 0) {
    return sites[0];
  }
  
  // Create a dummy site if no sites exist
  return createSite({
    name: 'Default Site',
    location: 'Default Location',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });
};
