
import { DateRange as RDPDateRange } from 'react-day-picker';

export interface Site {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
  timezone: string;
  lat: number;
  lng: number;
  created_at: string;
  updated_at: string;
  status?: 'active' | 'inactive' | 'maintenance';
  description?: string;
  site_type?: string;
  tags?: string[];
  main_image_url?: string;
  organization_id?: string;
  
  // Legacy/compatibility properties
  location?: string; // Maps to address
  type?: string;     // Maps to site_type
  building_type?: string;
  area?: number;
  contact_person?: string;
  contact_email?: string;
  contact_phone?: string;
}

export interface SiteFormData {
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
  timezone: string;
  lat?: number;
  lng?: number;
  status?: 'active' | 'inactive' | 'maintenance';
  description?: string;
  site_type?: string;
  tags?: string[];
  main_image_url?: string;
  organization_id?: string;
  
  // Legacy/compatibility properties
  location?: string;
  type?: string;
  building_type?: string;
  area?: number;
  contact_person?: string;
  contact_email?: string;
  contact_phone?: string;
}

export type DateRange = RDPDateRange;
