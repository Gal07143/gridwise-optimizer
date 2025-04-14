
export interface ConnectionStatusOptions {
  host: string;
  port: number;
  timeout?: number;
  retries?: number;
  deviceId?: string;
  autoReconnect?: boolean;
  retryInterval?: number;
  maxRetries?: number;
  initialStatus?: boolean;
  reconnectDelay?: number;
  showToasts?: boolean;
}

export interface ConnectionStatusResult {
  connected: boolean;
  message: string;
  latency?: number;
  isConnected?: boolean;
  isOnline?: boolean;
  error?: Error | null;
  retryConnection?: () => Promise<void>;
  lastConnected?: Date;
  connect?: () => Promise<void>;
  disconnect?: () => Promise<void>;
  connectionAttempts?: number;
  status?: 'connected' | 'connecting' | 'disconnected' | 'error' | 'ready';
}

export interface ModbusRegister {
  address: number;
  name: string;
  type: 'input' | 'holding' | 'coil' | 'discrete';
  dataType: 'int16' | 'uint16' | 'int32' | 'uint32' | 'float' | 'boolean';
  scale?: number;
  unit?: string;
  description?: string;
}
