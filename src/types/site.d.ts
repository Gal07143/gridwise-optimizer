
import { Dispatch, SetStateAction } from 'react';

export type SiteStatus = 'active' | 'inactive' | 'maintenance' | 'error';

export interface Site {
  id: string;
  name: string;
  location: string;
  timezone: string;
  lat?: number;
  lng?: number;
  created_at?: string;
  updated_at?: string;
  status?: SiteStatus;
}

export interface DateRange {
  from: Date;
  to: Date;
}

export interface DateRangePickerProps {
  dateRange: DateRange;
  onUpdate: (range: DateRange) => void;
}
