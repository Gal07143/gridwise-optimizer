
export type ModbusDataType = 'holding_register' | 'input_register' | 'coil' | 'discrete_input';

export interface ModbusDeviceConfig {
  id: string;
  name: string;
  ip: string;  // IP address of the Modbus device
  port: number;  // Port number (usually 502 for Modbus TCP)
  unit_id: number;  // Unit ID / Slave ID
  protocol: string;  // Protocol type (TCP, RTU over TCP, etc)
  description: string;
  is_active: boolean;
}

export interface ModbusDevice extends ModbusDeviceConfig {
  inserted_at?: string;
  updated_at?: string;
  serialPort?: string;
  baudRate?: number;
  host?: string;
  description: string;
  protocol: string;
}

export interface ModbusRegister {
  id: string;
  device_id: string;
  register_address: number;
  register_name: string;
  register_length: number;
  scaling_factor: number;
  created_at?: string;
  data_type?: ModbusDataType;
}

export interface ModbusRegisterMap {
  registers: {
    [address: string]: {
      name: string;
      length: number;
      scale: number;
      type: ModbusDataType;
    }
  };
}

export interface ModbusDataOptions {
  deviceId: string;
  registerAddress: number;
  length?: number;
  dataType?: ModbusDataType;
}

export interface ConnectionStatusResult {
  isConnected: boolean;
  lastConnection?: Date;
  error?: Error | string | null;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  retryConnection: () => Promise<boolean>;
}
