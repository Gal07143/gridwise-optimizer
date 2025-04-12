
export interface ModbusDevice {
  id: string;
  name: string;
  ip_address?: string;
  ip?: string;
  port: number;
  unit_id?: number;
  slave_id?: number;
  protocol: 'tcp' | 'rtu';
  description?: string;
  created_at?: string;
  last_online?: string;
  last_updated?: string;
  status?: 'online' | 'offline' | 'error';
  is_active?: boolean;
  enabled?: boolean;
}

export interface ModbusRegister {
  id: string;
  device_id: string;
  register_address: number;
  register_name: string;
  register_type: 'holding' | 'input' | 'coil' | 'discrete';
  data_type: 'int16' | 'uint16' | 'int32' | 'uint32' | 'float32' | 'float64' | 'bit' | 'string' | 'float';
  register_length: number;
  scaleFactor: number;
  unit?: string;
  description?: string;
  access?: 'read' | 'write' | 'read/write';
  address?: number; // Adding this for compatibility
}

export interface ModbusRegisterMap {
  device_id: string;
  name: string;
  description?: string;
  registers: ModbusRegisterDefinition[];
}

export interface ModbusRegisterDefinition {
  name: string;
  address: number;
  registerType: 'holding' | 'input' | 'coil' | 'discrete';
  dataType: 'int16' | 'uint16' | 'int32' | 'uint32' | 'float32' | 'float64' | 'bit' | 'string';
  access: 'read' | 'write' | 'read/write';
  description?: string;
}

export interface ModbusRegisterValue {
  register: ModbusRegister;
  value: number | string | boolean;
  timestamp: Date;
}

export interface ModbusOperationResult {
  success: boolean;
  value?: number | string | boolean | number[];
  error?: string;
  formattedValue?: string;
  timestamp?: Date;
}

export interface ModbusReadingResult {
  value: number | string | boolean;
  formattedValue: string;
  unit?: string;
  timestamp: string | Date;
  status: 'success' | 'error';
  error?: string | Error;
  success?: boolean;
  address?: number;
}

export interface ModbusDeviceConfig {
  id?: string;
  name: string;
  ip_address: string;
  ip?: string; // For compatibility
  port: number;
  unit_id: number;
  protocol: 'tcp' | 'rtu';
  description?: string;
  is_active?: boolean;
  status?: 'online' | 'offline' | 'error';
}

export interface ConnectionStatusOptions {
  deviceId: string;
  timeout?: number;
  autoReconnect?: boolean;
  retryInterval?: number;
  maxRetries?: number;
  initialStatus?: boolean;
  reconnectDelay?: number;
  showToasts?: boolean;
}

export interface ConnectionStatusResult {
  isConnected: boolean;
  isOnline?: boolean;
  error: Error | null;
  retryConnection?: () => Promise<void>;
  lastConnected?: Date;
  connectionAttempts?: number;
  status?: 'connected' | 'connecting' | 'disconnected' | 'error' | 'ready';
  message?: string;
  connect?: () => Promise<void>;
  disconnect?: () => Promise<void>;
}
