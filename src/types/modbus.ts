
export interface ModbusDevice {
  id: string;
  name: string;
  ip: string;
  port: number;
  unit_id: number; // Renamed from unitId to match DB schema
  is_active: boolean;
  inserted_at?: string;
  updated_at?: string;
  // Additional properties needed
  description?: string;
  protocol?: ModbusProtocol;
  host?: string;
  baudRate?: number;
  serialPort?: string;
  status?: string;
  lastConnected?: string;
}

export interface ModbusDeviceConfig {
  id?: string;
  name: string;
  ip: string;
  port: number;
  protocol: ModbusProtocol;
  unit_id: number;
  is_active?: boolean;
  // Additional properties needed
  description?: string;
  host?: string;
  serialPort?: string;
  baudRate?: number;
  dataBits?: number;
  stopBits?: number;
  parity?: string;
  timeout?: number;
  autoReconnect?: boolean;
  status?: string;
}

export interface ModbusRegisterMap {
  id: string;
  device_id: string;
  register_map: ModbusRegisterDefinition[];
  created_at?: string;
  updated_at?: string;
}

export interface ModbusRegisterDefinition {
  name: string;
  address: number;
  length: number;
  type: ModbusRegisterType;
  scaling?: number;
  unit?: string;
}

export type ModbusProtocol = 'TCP' | 'RTU' | 'ASCII';

export type ModbusRegisterType = 
  | 'coil'
  | 'discrete_input'
  | 'holding_register'
  | 'input_register'
  | 'uint16'
  | 'int16'
  | 'uint32'
  | 'int32'
  | 'float32';

// Define ModbusDataType alias for backward compatibility
export type ModbusDataType = ModbusRegisterType;

export interface ModbusReadResult {
  value: number | boolean | string;
  timestamp: string;
  register: ModbusRegisterDefinition;
}

export interface ModbusDataOptions {
  deviceId: string;
  register: ModbusRegisterDefinition;
  pollingInterval?: number;
}

export interface ConnectionStatusResult {
  isConnected: boolean;
  isLoading: boolean;
  error: Error | null;
  // Additional properties for modbus device monitoring
  device?: ModbusDevice;
  connect?: () => Promise<boolean>;
  disconnect?: () => Promise<void>;
  refreshDevice?: () => Promise<void>;
}
