import { Site, SiteFormData } from '@/types/site';
import { supabase } from '@/integrations/supabase/client';
// Fix crypto import if needed
// import { scrypt } from 'crypto';

export async function getSites(): Promise<Site[]> {
  try {
    const { data, error } = await supabase
      .from('sites')
      .select('*')
      .order('name');

    if (error) {
      throw new Error(error.message);
    }

    return data as Site[];
  } catch (error) {
    console.error('Error fetching sites:', error);
    throw error;
  }
}

export async function getSiteById(id: string): Promise<Site> {
  try {
    const { data, error } = await supabase
      .from('sites')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data as Site;
  } catch (error) {
    console.error(`Error fetching site with ID ${id}:`, error);
    throw error;
  }
}

export async function createSite(siteData: SiteFormData): Promise<Site> {
  try {
    const { data, error } = await supabase.from('sites').insert({
      name: siteData.name,
      location: siteData.location || `${siteData.city}, ${siteData.state}`,
      address: siteData.address,
      city: siteData.city,
      state: siteData.state,
      country: siteData.country,
      postal_code: siteData.postal_code,
      timezone: siteData.timezone,
      lat: siteData.lat,
      lng: siteData.lng,
      status: siteData.status || "active",
      description: siteData.description || "",
      site_type: siteData.site_type || "residential"
    }).select().single();

    if (error) {
      throw new Error(error.message);
    }

    return data as Site;
  } catch (error) {
    console.error('Error creating site:', error);
    throw error;
  }
}

export async function updateSite(id: string, siteData: Partial<Site>): Promise<Site> {
  try {
    const { data, error } = await supabase
      .from('sites')
      .update(siteData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data as Site;
  } catch (error) {
    console.error(`Error updating site with ID ${id}:`, error);
    throw error;
  }
}

export async function deleteSite(id: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('sites')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(error.message);
    }
  } catch (error) {
    console.error(`Error deleting site with ID ${id}:`, error);
    throw error;
  }
}

export async function getSiteMetrics(id: string): Promise<any> {
  try {
    // In a real application, this would fetch metrics from a database or API
    // For now, we'll return mock data
    return {
      totalConsumption: Math.random() * 1000 + 500,
      totalProduction: Math.random() * 800 + 200,
      totalSavings: Math.random() * 200 + 50,
      peakDemand: Math.random() * 50 + 10,
      co2Saved: Math.random() * 500 + 100,
      devices: Math.floor(Math.random() * 10) + 2
    };
  } catch (error) {
    console.error(`Error fetching metrics for site with ID ${id}:`, error);
    throw error;
  }
}

export async function getSiteDevices(id: string): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from('devices')
      .select('*')
      .eq('site_id', id);

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  } catch (error) {
    console.error(`Error fetching devices for site with ID ${id}:`, error);
    throw error;
  }
}

export async function updateSiteImage(siteId: string, imageUrl: string): Promise<Site> {
  try {
    const { data, error } = await supabase
      .from('sites')
      .update({ 
        main_image_url: imageUrl
      })
      .eq('id', siteId)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data as Site;
  } catch (error) {
    console.error('Error updating site image:', error);
    throw error;
  }
}

// Mock data for development
export const mockSites: Site[] = [
  {
    id: 'site-1',
    name: 'Main Residence',
    location: 'San Francisco, CA',
    description: 'Primary residential installation with solar and battery storage',
    timezone: 'America/Los_Angeles',
    lat: 37.7749,
    lng: -122.4194,
    created_at: '2023-01-15T08:00:00Z',
    updated_at: '2023-06-20T15:30:00Z',
    type: 'residential',
    status: 'active',
    city: 'San Francisco',
    state: 'CA',
    country: 'USA',
    address: '123 Main St',
    postal_code: '94105',
    site_type: 'residential',
    contact_person: 'John Doe',
    contact_email: 'john@example.com',
    contact_phone: '+1-555-123-4567'
  },
  {
    id: 'site-2',
    name: 'Beach House',
    location: 'Malibu, CA',
    description: 'Vacation home with solar panels and EV charging',
    timezone: 'America/Los_Angeles',
    lat: 34.0259,
    lng: -118.7798,
    created_at: '2023-03-10T10:15:00Z',
    updated_at: '2023-07-05T09:45:00Z',
    type: 'residential',
    status: 'active',
    city: 'Malibu',
    state: 'CA',
    country: 'USA',
    address: '456 Ocean Dr',
    postal_code: '90265',
    site_type: 'residential',
    contact_person: 'Jane Smith',
    contact_email: 'jane@example.com',
    contact_phone: '+1-555-987-6543'
  },
  {
    id: 'site-3',
    name: 'Downtown Office',
    location: 'New York, NY',
    description: 'Commercial office building with rooftop solar installation',
    timezone: 'America/New_York',
    lat: 40.7128,
    lng: -74.006,
    created_at: '2023-02-20T14:30:00Z',
    updated_at: '2023-08-12T11:20:00Z',
    type: 'commercial',
    status: 'active',
    city: 'New York',
    state: 'NY',
    country: 'USA',
    address: '789 Broadway',
    postal_code: '10003',
    site_type: 'commercial',
    contact_person: 'Robert Johnson',
    contact_email: 'robert@example.com',
    contact_phone: '+1-555-456-7890'
  }
];

// Function to generate a mock site for development
export function generateMockSite(): Site {
  const id = `site-${Math.floor(Math.random() * 1000)}`;
  const createdDate = new Date();
  createdDate.setDate(createdDate.getDate() - Math.floor(Math.random() * 365));
  
  const updatedDate = new Date(createdDate);
  updatedDate.setDate(updatedDate.getDate() + Math.floor(Math.random() * 30));
  
  const cities = ['San Francisco', 'Los Angeles', 'New York', 'Chicago', 'Miami', 'Seattle'];
  const states = ['CA', 'CA', 'NY', 'IL', 'FL', 'WA'];
  const types = ['residential', 'commercial', 'industrial'];
  const statuses = ['active', 'inactive', 'maintenance'];
  
  const cityIndex = Math.floor(Math.random() * cities.length);
  const typeIndex = Math.floor(Math.random() * types.length);
  const statusIndex = Math.floor(Math.random() * statuses.length);
  
  return {
    id,
    name: `Site ${id.split('-')[1]}`,
    location: `${cities[cityIndex]}, ${states[cityIndex]}`,
    description: `This is a ${types[typeIndex]} site located in ${cities[cityIndex]}.`,
    timezone: cityIndex <= 1 ? 'America/Los_Angeles' : cityIndex === 2 ? 'America/New_York' : 'America/Chicago',
    lat: Math.random() * 10 + 35,
    lng: Math.random() * 50 - 100,
    created_at: createdDate.toISOString(),
    updated_at: updatedDate.toISOString(),
    type: types[typeIndex],
    status: statuses[statusIndex],
    city: cities[cityIndex],
    state: states[cityIndex],
    country: 'USA',
    address: `${Math.floor(Math.random() * 1000) + 100} Main St`,
    postal_code: `${Math.floor(Math.random() * 90000) + 10000}`,
    site_type: types[typeIndex]
  };
}

// Function to generate multiple mock sites
export function generateMockSites(count: number): Site[] {
  return Array.from({ length: count }, () => generateMockSite());
}

// Mock function to simulate creating a site with form data
export async function mockCreateSite(formData: SiteFormData): Promise<Site> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newSite: Site = {
        id: `site-${Math.floor(Math.random() * 1000)}`,
        name: formData.name,
        location: formData.location,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        country: formData.country,
        postal_code: formData.postal_code,
        timezone: formData.timezone,
        lat: formData.lat,
        lng: formData.lng,
        status: formData.status || "active",
        description: formData.description || "",
        site_type: formData.site_type || "residential",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      resolve(newSite);
    }, 500);
  });
}
