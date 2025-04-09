
export interface ModbusDeviceConfig {
  id: string;
  name: string;
  ip: string;
  ip_address?: string; // Alias for compatibility
  port: number;
  unit_id: number;
  protocol: "tcp" | "rtu";
  is_active: boolean;
  description?: string;
  site_id?: string;
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

export interface ConnectionStatusOptions {
  autoConnect?: boolean;
  retryInterval?: number;
  maxRetries?: number;
  initialStatus?: boolean;
  reconnectDelay?: number;
  showToasts?: boolean;
  deviceId?: string;
}

export interface ModbusWriteRequest {
  registerAddress: number;
  value: number | boolean;
  registerType: "holding_register" | "coil";
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

export type ModbusDevice = ModbusDeviceConfig;
