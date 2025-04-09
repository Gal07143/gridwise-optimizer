
export interface ModbusDevice {
  id: string;
  name: string;
  ip_address: string;
  port: number;
  unit_id: number;
  status: 'online' | 'offline' | 'error';
  protocol: string; // Add protocol property
  description?: string; // Add description property
  last_connected?: string;
  created_at: string;
  updated_at: string;
  is_active: boolean; // Make is_active non-optional
  site_id?: string; // Add site_id property
}

export interface ModbusDeviceConfig {
  id?: string;
  name: string;
  ip_address: string;
  port: number;
  unit_id: number;
  protocol: string;
  site_id?: string; // Add site_id property
}

export interface ModbusRegisterDefinition {
  address: number;
  name: string;
  description?: string;
  dataType: 'uint16' | 'int16' | 'uint32' | 'int32' | 'float32' | 'string';
  scaleFactor?: number;
  unit?: string;
  access: 'read' | 'write' | 'read-write';
  registerType: 'holding' | 'input' | 'coil' | 'discrete';
}

export interface ModbusRegisterMap {
  id?: string;
  name: string;
  description?: string;
  device_id?: string;
  created_at?: string;
  updated_at?: string;
  registers: ModbusRegisterDefinition[];
}

export interface ConnectionStatusOptions {
  showToasts?: boolean; // Add missing properties
  autoConnect?: boolean;
  deviceId?: string;
  initialStatus?: boolean;
  reconnectDelay?: number;
  retryInterval?: number;
  maxRetries?: number;
}

export interface ConnectionStatus {
  isOnline: boolean;
  lastConnected?: Date;
  connectionAttempts: number;
  error?: Error;
}

export interface ConnectionStatusResult {
  isOnline: boolean;
  isConnecting?: boolean;
  isConnected?: boolean;
  lastConnected?: Date;
  lastOnline?: Date | null; // Add missing properties
  lastOffline?: Date | null;
  error?: Error | null;
  connect?: () => Promise<void>;
  disconnect?: () => Promise<void>;
  retryConnection?: () => Promise<void>;
  status?: 'connected' | 'disconnected' | 'connecting' | 'error';
  message?: string;
}
