
// Basic device interface
export interface Device {
  id: string;
  name: string;
  type: string;
  status: 'online' | 'offline' | 'maintenance' | 'error';
  protocol?: string;
  location?: string;
  installed_at?: string;
  last_maintenance?: string;
  created_at?: string;
  updated_at?: string;
  properties?: Record<string, any>;
  [key: string]: any; // Allow additional properties
}

// Telemetry data structure
export interface TelemetryData {
  id?: string;
  device_id: string;
  timestamp: Date | string;
  value: number;
  unit: string;
  parameter: string;
  [key: string]: any; // Allow additional fields
}

// Device status enum
export type DeviceStatus = 'online' | 'offline' | 'maintenance' | 'error' | 'warning';

// Device query parameters
export interface DeviceQueryParams {
  type?: string;
  status?: DeviceStatus;
  location?: string;
  search?: string;
  sort?: string;
  limit?: number;
  offset?: number;
}

// Device control command
export interface DeviceCommand {
  id?: string;
  device_id: string;
  command: string;
  parameters?: Record<string, any>;
  timestamp?: Date | string;
  status?: 'pending' | 'sent' | 'acknowledged' | 'completed' | 'failed';
  result?: any;
}

// Device registration request
export interface DeviceRegistrationRequest {
  name: string;
  type: string;
  protocol: string;
  location?: string;
  properties?: Record<string, any>;
}
