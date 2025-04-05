/**
 * Types for the Modbus connection system
 */

export type ModbusProtocol = 'TCP' | 'RTU' | 'ASCII';

export type ModbusDataType = 'coil' | 'discreteInput' | 'inputRegister' | 'holdingRegister';

export interface ModbusDeviceConfig {
  id: string;
  name: string;
  description?: string;
  protocol: ModbusProtocol;
  host?: string;
  port?: number;
  unitId: number;
  serialPort?: string;
  baudRate?: number;
  dataBits?: number;
  stopBits?: number;
  parity?: 'none' | 'even' | 'odd';
  timeout?: number;
  autoReconnect?: boolean;
  status?: 'online' | 'offline' | 'error' | 'connecting';
  lastConnected?: string;
}

export interface ModbusRegisterMap {
  [key: string]: {
    address: number;
    type: ModbusDataType;
    dataType?: 'int16' | 'uint16' | 'int32' | 'uint32' | 'float32' | 'float64' | 'boolean';
    bitPosition?: number;
    scale?: number;
    offset?: number;
    units?: string;
    description?: string;
  };
}

export interface ModbusDeviceData {
  deviceId: string;
  timestamp: string;
  values: Record<string, number | boolean>;
  error?: string;
}

export interface ModbusReadOptions {
  quantity?: number;
  dataType?: 'int16' | 'uint16' | 'int32' | 'uint32' | 'float32' | 'float64' | 'boolean';
  scale?: number;
  offset?: number;
}

export interface ModbusWriteOptions {
  dataType?: 'int16' | 'uint16' | 'int32' | 'uint32' | 'float32' | 'float64' | 'boolean';
  scale?: number;
}

export interface ModbusConnectionStatus {
  connected: boolean;
  lastError?: string;
  reconnectAttempts?: number;
  lastConnectAttempt?: string;
}
