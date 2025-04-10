
export interface ModbusDevice {
  id: string;
  name: string;
  device_id?: string;
  ip_address?: string;
  ip?: string; // For compatibility
  port: number;
  slave_id?: number;
  unit_id?: number; // For compatibility
  status: 'online' | 'offline' | 'error';
  created_at?: string;
  inserted_at?: string; // For compatibility
  updated_at?: string;
  site_id?: string;
  protocol: 'TCP' | 'RTU';
  description?: string;
  manufacturer?: string;
  model?: string;
  is_active?: boolean;
}

export interface ModbusDeviceConfig {
  name: string;
  ip_address: string;
  port: number;
  slave_id: number;
  protocol: 'TCP' | 'RTU';
  description?: string;
  site_id: string;
}

export interface ModbusRegisterMap {
  id: string;
  device_id: string;
  registers: ModbusRegister[];
  created_at: string;
  updated_at?: string;
}

export interface ModbusRegister {
  name: string;
  address: number;
  register_type: 'coil' | 'discrete_input' | 'holding' | 'input';
  data_type: 'int16' | 'uint16' | 'int32' | 'uint32' | 'float' | 'boolean';
  register_address: number;
  register_name: string;
  register_length: number;
  scaleFactor?: number;
}

export interface ModbusRegisterDefinition {
  register_address: number;
  register_name: string;
  register_length: number;
  scaleFactor?: number;
  register_type?: 'coil' | 'discrete_input' | 'holding' | 'input';
  data_type?: 'int16' | 'uint16' | 'int32' | 'uint32' | 'float' | 'boolean';
}

export interface ModbusReadResult {
  address: number;
  value: number | boolean;
  timestamp: string;
}

export interface ModbusReadingResult {
  address: number;
  value: number | boolean;
  timestamp: string;
  formattedValue?: string;
  success: boolean;
}

export interface ModbusWriteResult {
  success: boolean;
  message?: string;
  timestamp: string;
}
