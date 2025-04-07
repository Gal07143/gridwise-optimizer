
export interface Site {
  id: string;
  name: string;
  location: string;
  description?: string;
  type?: string;
  status?: string;
  lat: number;
  lng: number;
  timezone: string;
  created_at: string;
  updated_at: string;
  energy_category?: string;
  building_type?: string;
  area?: number;
  contact_person?: string;
  contact_phone?: string;
  contact_email?: string;
  address?: string;
}

export type SiteFormInput = Omit<Site, 'id' | 'created_at' | 'updated_at'>;

export type SiteFormData = Omit<Site, 'id' | 'created_at' | 'updated_at'>;

export interface DateRange {
  from: Date;
  to: Date;
}
