
export interface Device {
  id: string;
  name: string;
  type: string;
  protocol: string;
  status: 'online' | 'offline' | 'warning' | 'error';
  location?: string;
  description?: string;
  manufacturer?: string;
  model?: string;
  serial_number?: string;
  firmware_version?: string;
  installation_date?: string;
  last_maintenance?: string;
  ip_address?: string;
  mac_address?: string;
  created_at: string;
  updated_at: string;
  tags?: string[];
  metadata?: Record<string, any>;
  capabilities?: string[];
  group_id?: string;
  site_id?: string;
  parent_id?: string;
}

export interface TelemetryData {
  id: string;
  device_id: string;
  timestamp: string;
  measurement: string;
  value: number;
  unit?: string;
  quality?: 'good' | 'questionable' | 'bad';
  source?: string;
  tags?: Record<string, string>;
  [key: string]: any;
}

export interface DeviceCredentials {
  id: string;
  device_id: string;
  username?: string;
  password?: string;
  api_key?: string;
  token?: string;
  certificate?: string;
  last_rotated?: string;
}

export interface DeviceGroup {
  id: string;
  name: string;
  description?: string;
  parent_id?: string;
  devices: string[];
  created_at: string;
  updated_at: string;
}

export interface DeviceCommand {
  id: string;
  device_id: string;
  command: string;
  parameters?: Record<string, any>;
  status: 'pending' | 'sent' | 'delivered' | 'executed' | 'failed' | 'timeout';
  result?: any;
  sent_at?: string;
  completed_at?: string;
  error?: string;
}

export interface DeviceConfiguration {
  id: string;
  device_id: string;
  config: Record<string, any>;
  version: number;
  active: boolean;
  created_at: string;
  applied_at?: string;
}
