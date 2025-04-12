
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
  timestamp: Date;
  status: 'success' | 'error';
  error?: string;
}

export interface ModbusDeviceConfig {
  name: string;
  ip_address: string;
  port: number;
  unit_id: number;
  protocol: 'tcp' | 'rtu';
  description?: string;
}

export interface ConnectionStatusOptions {
  deviceId: string;
  timeout?: number;
  autoReconnect?: boolean;
}

export interface ConnectionStatusResult {
  isConnected: boolean;
  error: Error | null;
  retryConnection?: () => Promise<void>;
  lastConnected?: Date;
  connectionAttempts?: number;
}
