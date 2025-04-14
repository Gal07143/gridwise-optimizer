
import { Site } from '@/types/site';
import { mockSites } from './mockSites';

export interface CreateSiteParams {
  name: string;
  description?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  zip?: string;
  latitude?: number;
  longitude?: number;
  timezone?: string;
  status?: 'active' | 'inactive' | 'maintenance';
  owner?: string;
  area?: number;
  area_unit?: string;
}

export interface UpdateSiteParams extends Partial<CreateSiteParams> {
  id: string;
}

export const siteService = {
  async getSites(): Promise<Site[]> {
    // In a real implementation, this would fetch from an API
    return mockSites;
  },

  async getSite(id: string): Promise<Site | null> {
    // In a real implementation, this would fetch a specific site
    const site = mockSites.find(s => s.id === id);
    return site || null;
  },

  async createSite(params: CreateSiteParams): Promise<Site> {
    // In a real implementation, this would create a new site through an API
    const newSite: Site = {
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      status: 'active',
      ...params
    };
    
    return newSite;
  },

  async updateSite(params: UpdateSiteParams): Promise<Site> {
    // In a real implementation, this would update a site through an API
    const site = mockSites.find(s => s.id === params.id);
    
    if (!site) {
      throw new Error(`Site with ID ${params.id} not found`);
    }
    
    const updatedSite: Site = {
      ...site,
      ...params,
      updated_at: new Date().toISOString()
    };
    
    return updatedSite;
  },

  async deleteSite(id: string): Promise<boolean> {
    // In a real implementation, this would delete a site through an API
    return true;
  }
};

// Also export just functions for users who prefer functional approach
export const getSites = siteService.getSites;
export const getSite = siteService.getSite;
export const createSite = siteService.createSite;
export const updateSite = siteService.updateSite;
export const deleteSite = siteService.deleteSite;
