
export interface Alert {
  id: string;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info' | 'warning';
  title?: string;
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
  acknowledged?: boolean;
  acknowledged_at?: string;
  acknowledged_by?: string;
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
