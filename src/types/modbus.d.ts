
export interface ModbusDevice {
  id: string;
  name: string;
  ip_address?: string;
  ip?: string; // For compatibility
  port: number;
  unit_id: number;
  protocol: 'tcp' | 'rtu';
  site_id?: string;
  description?: string;
  status?: 'active' | 'inactive' | 'error';
  created_at?: string;
  last_updated?: string;
}

export interface ModbusRegister {
  id: string;
  device_id: string;
  register_address: number;
  register_name: string;
  register_type: 'holding' | 'input' | 'coil' | 'discrete';
  register_length: number;
  data_type: 'int16' | 'int32' | 'uint16' | 'uint32' | 'float' | 'float32' | 'float64' | 'bit' | 'string';
  access?: 'read' | 'write' | 'read/write';
  description?: string;
  scaleFactor?: number;
  unit?: string;
}

export type ModbusRegisterDefinition = {
  name: string;
  address: number;
  registerType: 'holding' | 'input' | 'coil' | 'discrete';
  dataType: 'int16' | 'int32' | 'uint16' | 'uint32' | 'float32' | 'float64' | 'bit';
  access: 'read' | 'write' | 'read/write';
  description?: string;
};

export interface ModbusRegisterMap {
  id?: string;
  device_id: string;
  name?: string;
  registers: ModbusRegisterDefinition[];
}

export interface ModbusRegisterValue {
  register_address: number;
  value: number | boolean | string;
  timestamp: string;
}

export interface ModbusWriteRequest {
  device_id: string;
  register_address: number;
  value: number | boolean;
  register_type?: 'holding' | 'coil';
}
