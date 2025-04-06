
// Define interfaces for Modbus device configuration
export interface ModbusDeviceConfig {
  id?: string;
  name: string;
  description?: string;
  ip: string;
  port: number;
  unit_id: number;
  is_active: boolean;
  protocol?: string;
}

// Extended ModbusDevice type that includes timestamps
export interface ModbusDevice extends ModbusDeviceConfig {
  inserted_at: string;
  updated_at: string;
}

// Define the type of Modbus data
export type ModbusDataType = 
  | 'input_register' 
  | 'holding_register' 
  | 'coil'
  | 'discrete_input';

// Define the interface for a Modbus register definition
export interface ModbusRegisterDefinition {
  name: string;
  address: number;
  length: number;
  dataType: ModbusDataType;
  scale?: number;
  unit?: string;
  description?: string;
}

// Define the interface for a Modbus register map
export interface ModbusRegisterMap {
  id?: string;
  device_id?: string;
  registers: ModbusRegisterDefinition[];
}

// Connection status result
export interface ConnectionStatus {
  isConnected: boolean;
  error?: string | null;
}

// Options for connection
export interface ConnectionStatusOptions {
  timeout?: number;
  retries?: number;
}

// Result of connection check
export interface ConnectionStatusResult {
  status: ConnectionStatus;
  connect: () => Promise<ConnectionStatus>;
  disconnect: () => Promise<void>;
}
