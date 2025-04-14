
export interface ModbusRegister {
  register_address: number;
  name: string;
  description?: string;
  data_type: 'int16' | 'uint16' | 'int32' | 'uint32' | 'float32' | 'float64' | 'string' | 'boolean';
  unit?: string;
  scale_factor?: number;
  access: 'r' | 'w' | 'rw';
  group?: string;
  is_active?: boolean;
}

export interface ModbusDevice {
  id: string;
  name: string;
  ip_address: string;
  port: number;
  unit_id: number;
  protocol: 'TCP' | 'RTU' | 'RTU over TCP';
  model?: string;
  manufacturer?: string;
  status: 'online' | 'offline' | 'error';
  last_connected?: string;
  last_error?: string;
  registers?: ModbusRegister[];
}

export interface ModbusReadResult {
  success: boolean;
  register?: number;
  value?: number | boolean | string | Array<number>;
  formattedValue?: string;
  unit?: string;
  timestamp?: string;
  error?: string;
}

export interface ModbusWriteResult {
  success: boolean;
  register?: number;
  value?: number | boolean | string;
  error?: string;
}
