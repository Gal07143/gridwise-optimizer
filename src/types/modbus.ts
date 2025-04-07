export interface ModbusDevice {
  id: string;
  name: string;
  ip: string;         // Backward compatibility with ip_address
  ip_address?: string; // New property name
  port: number;
  unit_id: number;
  is_active: boolean;
  status?: string;
  description?: string;
  protocol?: string;
  created_at?: string;
  updated_at?: string;
}

export type ModbusDeviceConfig = Omit<ModbusDevice, 'id'>;

export interface ModbusRegisterDefinition {
  name: string;
  address: number;
  registerType: 'input' | 'holding' | 'coil' | 'discrete';
  dataType: 'int16' | 'uint16' | 'int32' | 'uint32' | 'float32' | 'float64' | 'bit';
  access: 'read' | 'write' | 'read/write';
  description?: string;
  unit?: string;
  scaleFactor?: number;
  // Legacy properties for compatibility
  length?: number;
  type?: string;
  scale?: number;
}

export interface ModbusRegisterMap {
  id?: string;
  name: string;
  device_id: string;
  registers: ModbusRegisterDefinition[];
  created_at?: string;
  updated_at?: string;
}

export interface ModbusReadingResult {
  value: number | boolean;
  address: number;
  buffer?: Buffer;
  raw?: any;
  error?: Error;
}

export interface ConnectionStatusOptions {
  initialStatus?: boolean;
  reconnectDelay?: number;
  showToasts?: boolean;
}

export interface ConnectionStatus {
  online: boolean;
  lastOnline: Date | null;
  lastOffline: Date | null;
}

export interface ConnectionStatusResult {
  isOnline: boolean;
  lastOnline: Date | null;
  lastOffline: Date | null;
  isConnected?: boolean;
  isConnecting?: boolean;
  connect?: () => void;
  disconnect?: () => void;
  retryConnection?: () => void;
}
