export interface ModbusDevice {
  id: string;
  name: string;
  ip_address: string;
  port: number;
  unit_id: number;
  status: 'online' | 'offline' | 'error';
  last_connected?: string;
  created_at: string;
  updated_at: string;
  protocol?: string;
  description?: string;
}

export interface ModbusDeviceConfig {
  id?: string;
  name: string;
  ip_address: string;
  port: number;
  unit_id: number;
  protocol: string;
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
  showToasts?: boolean;
  autoConnect?: boolean;
  deviceId?: string;
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
  lastConnected?: Date;
  error: Error | null;
  connect?: () => Promise<void>;
  disconnect?: () => void;
}
