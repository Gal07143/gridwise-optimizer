
export interface ModbusDevice {
  id: string;
  name: string;
  ip_address: string;
  port: number;
  unit_id: number;
  status: 'online' | 'offline' | 'error';
  protocol: 'tcp' | 'rtu'; 
  description?: string;
  last_connected?: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  site_id?: string;
  ip?: string; // Add compatibility with both naming conventions
}

export interface ModbusDeviceConfig {
  id?: string;
  name: string;
  ip_address?: string;
  ip?: string; // Add compatibility with both naming conventions
  port: number;
  unit_id: number;
  protocol: 'tcp' | 'rtu';
  site_id?: string;
  is_active?: boolean;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ModbusRegisterDefinition {
  id: string;
  address: number;
  name: string;
  description?: string;
  dataType: 'uint16' | 'int16' | 'uint32' | 'int32' | 'float32' | 'string';
  scaleFactor?: number;
  scaling_factor?: number; // Alias for compatibility
  unit?: string;
  access: 'read' | 'write' | 'read/write';
  registerType: 'holding' | 'input' | 'coil' | 'discrete';
  device_id?: string;
  register_address?: number;
  register_name?: string;
  register_length?: number;
}

export interface ModbusRegisterMap {
  id?: string;
  name?: string; // Make name optional
  description?: string;
  device_id?: string;
  created_at?: string;
  updated_at?: string;
  registers: ModbusRegisterDefinition[];
}

export interface ConnectionStatusOptions {
  showToasts?: boolean;
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
  lastOnline?: Date | null;
  lastOffline?: Date | null;
  error?: Error | null;
  connect?: () => Promise<void>;
  disconnect?: () => Promise<void>;
  retryConnection?: () => Promise<void>;
  status?: 'connected' | 'disconnected' | 'connecting' | 'error';
  message?: string;
}

export interface ModbusReadingResult {
  address: number;
  value: number;
  formattedValue: string;
  timestamp: string;
  success: boolean;
  error?: Error | string; // Allow both Error and string
}

export interface ModbusWriteRequest {
  registerAddress: number;
  value: number | boolean;
  registerType: "holding_register" | "coil";
}
