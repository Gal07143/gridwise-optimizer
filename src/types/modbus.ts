
export interface ModbusDeviceConfig {
  id: string;
  name: string;
  ip: string;
  ip_address?: string; // Alias for compatibility
  port: number;
  unit_id: number;
  slave_id?: number; // Add for compatibility
  protocol: "tcp" | "rtu";
  is_active: boolean;
  description?: string;
  site_id?: string;
  updated_at?: string;
  created_at?: string;
  status?: 'online' | 'offline' | 'error' | 'maintenance'; // Add status field
}

export interface ModbusRegisterDefinition {
  id: string;
  device_id?: string;
  name: string;
  address: number;
  registerType: "input" | "holding";
  dataType: "int16" | "uint16" | "int32" | "uint32" | "float32";
  access: "read" | "write" | "read/write";
  scaleFactor?: number;
  unit?: string;
  description?: string;
  register_address?: number;
  register_name?: string;
  register_length?: number;
}

export interface ModbusRegisterMap {
  registers: ModbusRegisterDefinition[];
  id?: string;
  name?: string;
  device_id?: string;
}

export interface ModbusReadingResult {
  address: number;
  value: number;
  formattedValue: string;
  timestamp: string;
  success: boolean;
  error?: Error;
}

export type ModbusReadResult = ModbusReadingResult;

export interface ModbusWriteResult {
  success: boolean;
  message?: string;
  timestamp: string;
}

export interface ConnectionStatusOptions {
  autoConnect?: boolean;
  retryInterval?: number;
  maxRetries?: number;
  initialStatus?: boolean;
  reconnectDelay?: number;
  showToasts?: boolean;
  deviceId?: string;
}

export interface ConnectionStatusResult {
  status: 'connected' | 'connecting' | 'disconnected' | 'error' | 'ready';
  message?: string;
  isOnline?: boolean;
  isConnected?: boolean;
  isConnecting?: boolean;
  lastOnline?: Date | null;
  lastOffline?: Date | null;
  connect?: () => Promise<void>;
  disconnect?: () => Promise<void>;
  retryConnection?: () => Promise<void>;
  error: Error | null;
  lastConnected?: Date;
}

export interface ModbusDevice extends ModbusDeviceConfig {
  // Ensure ModbusDevice has all the properties that ModbusDeviceConfig has
  protocol: "tcp" | "rtu";
  description?: string;  
  ip_address?: string;
  status?: 'online' | 'offline' | 'error' | 'maintenance'; // Add status field
}

export interface ModbusRegister {
  id?: string;
  name: string;
  address: number;
  register_type: "holding" | "input" | "coil" | "discrete_input";
  data_type: "int16" | "uint16" | "int32" | "uint32" | "float" | "boolean" | "string";
  device_id: string;
  scaling_factor?: number;
  unit?: string;
  description?: string;
  register_address?: number;
  register_name?: string;
  register_length?: number;
  scaleFactor?: number;
}
