
export interface ModbusDeviceConfig {
  id: string;
  name: string;
  protocol: 'TCP' | 'RTU' | 'ASCII';
  unit_id: number;
  // TCP specific
  host?: string;
  port?: number;
  // Serial specific
  serialPort?: string;
  baudRate?: number;
  dataBits?: 7 | 8;
  stopBits?: 1 | 2;
  parity?: 'none' | 'even' | 'odd';
  timeout?: number;
  autoReconnect?: boolean;
  description?: string;
}

export type ModbusDevice = ModbusDeviceConfig;

export type ModbusDataType = 'coil' | 'input' | 'holding_register' | 'input_register';

export interface ModbusDataOptions {
  address: number;
  dataType: ModbusDataType;
  quantity?: number;
}

export interface ModbusRegisterMap {
  id?: string;
  device_id: string;
  address: number;
  name: string;
  description?: string;
  register_type: ModbusDataType;
  data_type?: string;
  unit?: string;
  scale_factor?: number;
  access?: 'read' | 'write' | 'read-write';
  default_value?: number | string;
  created_at?: string;
  updated_at?: string;
}

export interface ModbusReading {
  id?: string;
  device_id: string;
  register_id?: string;
  address: number;
  value: number | boolean;
  raw_value?: number | boolean;
  timestamp: string;
  quality?: number;
  register_type: ModbusDataType;
}

export interface ConnectionStatusResult {
  isConnected: boolean;
  connect: () => Promise<boolean>;
  disconnect: () => Promise<void>;
}
