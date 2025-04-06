
// File: src/types/modbus.ts
export interface ModbusDevice {
  id: string;
  name: string;
  ip: string;
  port: number;
  unit_id: number;
  is_active: boolean;
  inserted_at: string;
  updated_at: string;
  // Additional properties needed by components
  description?: string;
  protocol?: string;
  host?: string;
  serialPort?: string;
  baudRate?: number;
  dataBits?: number;
  stopBits?: number;
  parity?: string;
  timeout?: number;
  status?: string;
  lastConnected?: string;
  site_id?: string;
}

export type ModbusProtocol = 'TCP' | 'RTU' | 'ASCII';
export type ModbusParity = 'none' | 'even' | 'odd';
export type ModbusRegisterType = 'holding_register' | 'input_register' | 'coil' | 'discrete_input';

export interface ModbusDeviceConfig {
  id?: string;
  name: string;
  ip: string;
  port: number;
  unit_id: number;
  protocol: ModbusProtocol;
  is_active: boolean;
  description?: string;
  host?: string;
  serialPort?: string;
  baudRate?: number;
  dataBits?: number;
  stopBits?: number;
  parity?: ModbusParity;
  timeout?: number;
  autoReconnect?: boolean;
  status?: string;
  lastConnected?: string;
  inserted_at?: string;
  updated_at?: string;
  site_id?: string;
}

export interface ModbusRegisterDefinition {
  address: number;
  length: number;
  name: string;
  type: ModbusRegisterType;
  dataType: ModbusDataType;
  scaleFactor?: number;
  scale?: number;
  unit?: string;
  description?: string;
}

export interface ModbusRegister {
  id: string;
  device_id: string;
  register_address: number;
  register_name: string;
  register_length: number;
  scaling_factor: number;
  created_at?: string;
}

export type ModbusDataType = 
  'int16' | 
  'uint16' | 
  'int32' | 
  'uint32' | 
  'float32' | 
  'float64' | 
  'boolean' | 
  'string' |
  'holding_register' |
  'coil' |
  'input_register' |
  'discrete_input';

export interface ModbusRegisterMap {
  registers: ModbusRegisterDefinition[];
  device_id?: string;
  lastUpdated?: string;
}

export interface ModbusDataOptions {
  address: number;
  length?: number;
  registerType: ModbusRegisterType;
  dataType?: ModbusDataType;
}

export interface ConnectionStatusOptions {
  deviceId?: string;
  interval?: number;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Error) => void;
}

export interface ConnectionStatus {
  isConnected: boolean;
  isConnecting: boolean;
  lastConnected: Date | null;
  error: Error | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  reconnect: () => Promise<void>;
  retryConnection?: () => void;
}

export interface ConnectionStatusResult {
  isConnected: boolean;
  error: Error | null;
  device?: ModbusDevice;
  loading?: boolean;
  connect?: () => Promise<boolean>;
  disconnect?: () => Promise<boolean>;
  refreshDevice?: () => Promise<void>;
  retryConnection?: () => void;
}
