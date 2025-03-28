
export interface Alert {
  id: string;
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'critical';
  timestamp: string;
  deviceId?: string;
  deviceName?: string;
  acknowledged: boolean;
  resolved: boolean;
  assignedTo?: string;
  category?: string;
  site_id?: string;
  metadata?: Record<string, any>;
}
