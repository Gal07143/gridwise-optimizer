
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
  protocol?: string;
  host?: string;
  baudRate?: number;
  serialPort?: string;
}

export interface ModbusDeviceConfig {
  id?: string;
  name: string;
  ip: string;
  port: number;
  protocol: string; // TCP or RTU
  unit_id: number;
  is_active?: boolean;
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
  connect?: () => Promise<void>;
  disconnect?: () => Promise<void>;
  refreshDevice?: () => Promise<void>;
}
