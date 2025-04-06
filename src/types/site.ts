
export interface DateRange {
  from: Date;
  to: Date;
}

export interface Site {
  id: string;
  name: string;
  location: string;
  timezone: string;
  type: string;
  status: string;
  description?: string;
  contact_person?: string;
  contact_phone?: string;
  contact_email?: string;
  lat: number | null;
  lng: number | null;
  created_at: string;
  updated_at: string;
}

export interface SiteFormData {
  id?: string;
  name: string;
  location: string;
  timezone: string;
  type: string;
  status: string;
  description?: string;
  contact_person?: string;
  contact_phone?: string;
  contact_email?: string;
  lat?: number | null;
  lng?: number | null;
}

export type SiteType = 'residential' | 'commercial' | 'industrial' | 'utility';
export type SiteStatus = 'active' | 'inactive' | 'maintenance' | 'planned';

export interface SiteStatistics {
  totalEnergy?: number;
  peakDemand?: number;
  costSavings?: number;
  co2Reduction?: number;
  selfConsumption?: number;
  gridImport?: number;
  gridExport?: number;
}

export interface DeviceCountBySite {
  siteId: string;
  siteName: string;
  deviceCount: number;
}

export interface DeviceCountByType {
  deviceType: string;
  count: number;
}
