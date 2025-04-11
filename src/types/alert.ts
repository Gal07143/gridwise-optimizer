
export interface Alert {
  id: string;
  title: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  device_id?: string;
  site_id?: string;
  acknowledged: boolean;
  updated_at?: string;
  created_at?: string;
  alert_source?: string;
  category?: string;
  resolution_steps?: string[];
}

export type AlertSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface AlertCountSummary {
  critical: number;
  high: number;
  medium: number;
  low: number;
  total: number;
}

export interface AlertFilters {
  severity?: AlertSeverity[];
  acknowledged?: boolean;
  timeRange?: 'today' | 'week' | 'month' | 'custom';
  startDate?: string;
  endDate?: string;
  deviceId?: string;
  siteId?: string;
}
