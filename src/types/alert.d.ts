
export interface Alert {
  id: string;
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'critical';
  timestamp: string;
  source?: string;
  deviceId?: string;
  deviceName?: string;
  acknowledged: boolean;
  resolved: boolean;
  assignedTo?: string;
  category?: string;
  site_id?: string;
  metadata?: Record<string, any>;
  // Compatibility with other Alert interface
  device_id?: string;
  acknowledged_at?: string;
  resolved_at?: string;
  type?: string;
  acknowledged_by?: string;
}
