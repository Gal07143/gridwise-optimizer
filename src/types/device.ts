
export interface Device {
  id: string;
  name: string;
  type: string;
  status: string;
  protocol?: string;
  location?: string;
  firmware_version?: string;
  created_at?: Date | string;
  updated_at?: Date | string;
  last_seen?: Date | string;
  metrics?: Record<string, any>;
  connection_info?: Record<string, any>;
  config?: Record<string, any>;
}

export interface TelemetryData {
  id: string;
  deviceId: string;
  timestamp: string;
  parameter?: string;
  value?: number;
  unit?: string;
  power?: number;
  energy?: number;
  voltage?: number;
  current?: number;
  data?: Record<string, any>;
  temperature?: number;
  measurement?: string;
}

export interface DeviceStatus {
  id: string;
  deviceId: string;
  timestamp: Date;
  status: 'online' | 'offline' | 'error' | 'maintenance';
  details?: string;
}

export interface DeviceEvent {
  id: string;
  deviceId: string;
  timestamp: Date;
  eventType: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  message: string;
  details?: Record<string, any>;
}

export interface DeviceCommand {
  id: string;
  deviceId: string;
  command: string;
  parameters?: Record<string, any>;
  timestamp: Date;
  status: 'pending' | 'sent' | 'acknowledged' | 'executed' | 'failed';
  result?: Record<string, any>;
}

export interface DeviceOperationalMetrics {
  uptime: number;
  errorRate: number;
  responseTime: number;
  lastCommunication: Date;
}
