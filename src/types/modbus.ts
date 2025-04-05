
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
}

export type ModbusProtocol = 'TCP' | 'RTU' | 'ASCII';
export type ModbusParity = 'none' | 'even' | 'odd';
export type ModbusRegisterType = 'holding_register' | 'input_register' | 'coil' | 'discrete_input';

export interface ModbusDeviceConfig {
  name: string;
  ip: string;
  port: number;
  unit_id: number;
  protocol: ModbusProtocol;
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
}

export interface ModbusRegisterDefinition {
  address: number;
  length: number;
  name: string;
  type: ModbusRegisterType;
  dataType: ModbusDataType;
  scaleFactor?: number;
  unit?: string;
  description?: string;
}

export type ModbusDataType = 
  'int16' | 
  'uint16' | 
  'int32' | 
  'uint32' | 
  'float32' | 
  'float64' | 
  'boolean' | 
  'string';

export interface ModbusRegisterMap {
  registers: ModbusRegisterDefinition[];
  lastUpdated?: string;
}

export interface ModbusDataOptions {
  address: number;
  length?: number;
  registerType: ModbusRegisterType;
  dataType?: ModbusDataType;
}

export interface ConnectionStatusResult {
  isConnected: boolean;
  error: Error | null;
  device?: ModbusDevice;
  loading?: boolean;
  connect?: () => Promise<boolean>;
  disconnect?: () => Promise<boolean>;
  refreshDevice?: () => Promise<void>;
}
