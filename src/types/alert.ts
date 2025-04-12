
export interface Alert {
  id: string;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info' | 'warning';
  message: string;
  device_id?: string;
  site_id?: string;
  timestamp: string;
  resolved: boolean;
  resolved_at?: string;
  resolved_by?: string;
  alert_source?: string;
  source?: string;
  category?: string;
  details?: Record<string, any>;
}

export interface AlertCountSummary {
  critical: number;
  high: number;
  medium: number;
  low: number;
  info?: number;
  warning?: number;
  total: number;
}
