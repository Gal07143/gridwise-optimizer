import ModbusRTU from 'modbus-serial';
import { toast } from 'sonner';
import { 
  ModbusDeviceConfig, 
  ModbusProtocol, 
  ModbusReadOptions, 
  ModbusWriteOptions,
  ModbusDataType
} from '@/types/modbus';

class ModbusClient {
  private client: ModbusRTU;
  private config: ModbusDeviceConfig | null = null;
  private connected = false;
  private connectionPromise: Promise<void> | null = null;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private reconnectInterval = 5000; // 5 seconds
  private maxReconnectAttempts = 5;
  private reconnectAttempts = 0;

  constructor() {
    this.client = new ModbusRTU();
  }

  /**
   * Connect to a Modbus device
   */
  async connect(config: ModbusDeviceConfig): Promise<boolean> {
    // If already connecting, wait for that to complete
    if (this.connectionPromise) {
      try {
        await this.connectionPromise;
        return this.connected;
      } catch (error) {
        // Continue with new connection attempt
      }
    }

    // Clear any existing reconnection timer
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    this.config = config;
    
    // Create a new connection promise
    this.connectionPromise = this.establishConnection(config);
    
    try {
      await this.connectionPromise;
      this.connected = true;
      this.reconnectAttempts = 0;
      return true;
    } catch (error: any) {
      this.connected = false;
      
      console.error(`Modbus connection failed: ${error.message}`);
      
      // Set up automatic reconnection if enabled
      if (config.autoReconnect && this.reconnectAttempts < this.maxReconnectAttempts) {
        this.scheduleReconnect();
      } else {
        toast.error(`Failed to connect to Modbus device "${config.name}"`);
      }
      
      return false;
    } finally {
      this.connectionPromise = null;
    }
  }

  /**
   * Establish the actual connection based on protocol
   */
  private async establishConnection(config: ModbusDeviceConfig): Promise<void> {
    try {
      // Close existing connection if any
      try {
        await this.client.close();
      } catch (e) {
        // Ignore close errors
      }
      
      switch (config.protocol) {
        case 'TCP': {
          if (!config.host || !config.port) {
            throw new Error('Host and port are required for TCP connections');
          }
          await this.client.connectTCP(config.host, { port: config.port });
          break;
        }
        
        case 'RTU': {
          if (!config.serialPort) {
            throw new Error('Serial port is required for RTU connections');
          }
          
          const options = {
            baudRate: config.baudRate || 9600,
            dataBits: config.dataBits || 8,
            stopBits: config.stopBits || 1,
            parity: config.parity || 'none'
          };
          
          await this.client.connectRTUBuffered(config.serialPort, options);
          break;
        }
        
        case 'ASCII': {
          if (!config.serialPort) {
            throw new Error('Serial port is required for ASCII connections');
          }
          
          const options = {
            baudRate: config.baudRate || 9600,
            dataBits: config.dataBits || 8,
            stopBits: config.stopBits || 1,
            parity: config.parity || 'none'
          };
          
          await this.client.connectAsciiSerial(config.serialPort, options);
          break;
        }
        
        default:
          throw new Error(`Unsupported protocol: ${config.protocol}`);
      }
      
      // Set timeout and unit ID
      this.client.setTimeout(config.timeout || 1000);
      this.client.setID(config.unitId);
      
      console.log(`Connected to Modbus device: ${config.name}`);
    } catch (error: any) {
      console.error(`Failed to establish Modbus connection: ${error.message}`);
      throw error;
    }
  }

  /**
   * Schedule a reconnection attempt
   */
  private scheduleReconnect() {
    if (!this.config?.autoReconnect || this.reconnectAttempts >= this.maxReconnectAttempts) {
      return;
    }
    
    this.reconnectAttempts++;
    
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }
    
    console.log(`Scheduling reconnection attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts} in ${this.reconnectInterval}ms`);
    
    this.reconnectTimeout = setTimeout(() => {
      console.log(`Attempting to reconnect to Modbus device (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
      
      if (this.config) {
        this.connect(this.config).catch(error => {
          console.error('Reconnection attempt failed:', error);
        });
      }
    }, this.reconnectInterval);
  }

  /**
   * Disconnect from the Modbus device
   */
  async disconnect(): Promise<void> {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    
    try {
      await this.client.close();
      this.connected = false;
      console.log('Disconnected from Modbus device');
    } catch (error: any) {
      console.error(`Error during disconnect: ${error.message}`);
    }
  }

  /**
   * Check if client is connected
   */
  isConnected(): boolean {
    return this.connected;
  }

  /**
   * Read coils (function code 01)
   */
  async readCoils(address: number, quantity: number = 1): Promise<boolean[]> {
    if (!this.connected) throw new Error('Not connected to Modbus device');
    
    try {
      const result = await this.client.readCoils(address, quantity);
      return result.data;
    } catch (error: any) {
      this.handleError(error);
      throw new Error(`Failed to read coils: ${error.message}`);
    }
  }

  /**
   * Read discrete inputs (function code 02)
   */
  async readDiscreteInputs(address: number, quantity: number = 1): Promise<boolean[]> {
    if (!this.connected) throw new Error('Not connected to Modbus device');
    
    try {
      const result = await this.client.readDiscreteInputs(address, quantity);
      return result.data;
    } catch (error: any) {
      this.handleError(error);
      throw new Error(`Failed to read discrete inputs: ${error.message}`);
    }
  }

  /**
   * Read holding registers (function code 03)
   */
  async readHoldingRegisters(address: number, options: ModbusReadOptions = {}): Promise<number | number[]> {
    if (!this.connected) throw new Error('Not connected to Modbus device');
    
    const quantity = options.quantity || 1;
    
    try {
      const result = await this.client.readHoldingRegisters(address, quantity);
      return this.processRegisterData(result.data, options);
    } catch (error: any) {
      this.handleError(error);
      throw new Error(`Failed to read holding registers: ${error.message}`);
    }
  }

  /**
   * Read input registers (function code 04)
   */
  async readInputRegisters(address: number, options: ModbusReadOptions = {}): Promise<number | number[]> {
    if (!this.connected) throw new Error('Not connected to Modbus device');
    
    const quantity = options.quantity || 1;
    
    try {
      const result = await this.client.readInputRegisters(address, quantity);
      return this.processRegisterData(result.data, options);
    } catch (error: any) {
      this.handleError(error);
      throw new Error(`Failed to read input registers: ${error.message}`);
    }
  }

  /**
   * Write single coil (function code 05)
   */
  async writeCoil(address: number, value: boolean): Promise<void> {
    if (!this.connected) throw new Error('Not connected to Modbus device');
    
    try {
      await this.client.writeCoil(address, value);
    } catch (error: any) {
      this.handleError(error);
      throw new Error(`Failed to write coil: ${error.message}`);
    }
  }

  /**
   * Write single register (function code 06)
   */
  async writeRegister(address: number, value: number, options: ModbusWriteOptions = {}): Promise<void> {
    if (!this.connected) throw new Error('Not connected to Modbus device');
    
    let scaledValue = value;
    
    // Apply scale if provided
    if (options.scale) {
      scaledValue = value / options.scale;
    }
    
    try {
      await this.client.writeRegister(address, Math.round(scaledValue));
    } catch (error: any) {
      this.handleError(error);
      throw new Error(`Failed to write register: ${error.message}`);
    }
  }

  /**
   * Write multiple coils (function code 15)
   */
  async writeCoils(address: number, values: boolean[]): Promise<void> {
    if (!this.connected) throw new Error('Not connected to Modbus device');
    
    try {
      await this.client.writeCoils(address, values);
    } catch (error: any) {
      this.handleError(error);
      throw new Error(`Failed to write coils: ${error.message}`);
    }
  }

  /**
   * Write multiple registers (function code 16)
   */
  async writeRegisters(address: number, values: number[], options: ModbusWriteOptions = {}): Promise<void> {
    if (!this.connected) throw new Error('Not connected to Modbus device');
    
    let scaledValues = values;
    
    // Apply scale if provided
    if (options.scale) {
      scaledValues = values.map(value => Math.round(value / options.scale));
    }
    
    try {
      await this.client.writeRegisters(address, scaledValues);
    } catch (error: any) {
      this.handleError(error);
      throw new Error(`Failed to write registers: ${error.message}`);
    }
  }

  /**
   * Read a specific data point using configured register map
   */
  async readDataPoint(dataPoint: string, registerMap: Record<string, any>): Promise<number | boolean> {
    if (!this.connected) throw new Error('Not connected to Modbus device');
    
    const config = registerMap[dataPoint];
    if (!config) {
      throw new Error(`Data point "${dataPoint}" not found in register map`);
    }
    
    const options: ModbusReadOptions = {
      dataType: config.dataType,
      scale: config.scale,
      offset: config.offset
    };
    
    try {
      switch (config.type) {
        case 'coil':
          const coilResult = await this.readCoils(config.address, 1);
          return coilResult[0];
          
        case 'discreteInput':
          const inputResult = await this.readDiscreteInputs(config.address, 1);
          return inputResult[0];
          
        case 'inputRegister':
          return await this.readInputRegisters(config.address, options) as number;
          
        case 'holdingRegister':
          return await this.readHoldingRegisters(config.address, options) as number;
          
        default:
          throw new Error(`Unsupported data point type: ${config.type}`);
      }
    } catch (error: any) {
      throw new Error(`Failed to read data point "${dataPoint}": ${error.message}`);
    }
  }

  /**
   * Write a specific data point using configured register map
   */
  async writeDataPoint(dataPoint: string, value: number | boolean, registerMap: Record<string, any>): Promise<void> {
    if (!this.connected) throw new Error('Not connected to Modbus device');
    
    const config = registerMap[dataPoint];
    if (!config) {
      throw new Error(`Data point "${dataPoint}" not found in register map`);
    }
    
    const options: ModbusWriteOptions = {
      dataType: config.dataType,
      scale: config.scale
    };
    
    try {
      switch (config.type) {
        case 'coil':
          if (typeof value !== 'boolean') {
            throw new Error('Value must be boolean for coil write');
          }
          await this.writeCoil(config.address, value);
          break;
          
        case 'holdingRegister':
          if (typeof value !== 'number') {
            throw new Error('Value must be number for register write');
          }
          await this.writeRegister(config.address, value, options);
          break;
          
        default:
          throw new Error(`Cannot write to data point of type: ${config.type}`);
      }
    } catch (error: any) {
      throw new Error(`Failed to write data point "${dataPoint}": ${error.message}`);
    }
  }

  /**
   * Process register data based on the specified data type and scaling
   */
  private processRegisterData(data: number[], options: ModbusReadOptions): number | number[] {
    if (data.length === 0) return [];
    if (!options.dataType && data.length === 1) return data[0];
    if (!options.dataType) return data;
    
    let result: number | number[];
    
    switch (options.dataType) {
      case 'int16':
        result = data.map(val => {
          // Convert to signed 16-bit integer
          return val > 32767 ? val - 65536 : val;
        });
        break;
        
      case 'uint16':
        result = data; // Already unsigned 16-bit
        break;
        
      case 'int32':
        result = [];
        for (let i = 0; i < data.length; i += 2) {
          if (i + 1 < data.length) {
            // Combine two 16-bit registers into one 32-bit value
            const val = (data[i] << 16) | data[i + 1];
            // Convert to signed 32-bit
            (result as number[]).push(val >= 0x80000000 ? val - 0x100000000 : val);
          }
        }
        break;
        
      case 'uint32':
        result = [];
        for (let i = 0; i < data.length; i += 2) {
          if (i + 1 < data.length) {
            // Combine two 16-bit registers into one 32-bit value
            (result as number[]).push((data[i] << 16) | data[i + 1]);
          }
        }
        break;
        
      case 'float32':
        result = [];
        for (let i = 0; i < data.length; i += 2) {
          if (i + 1 < data.length) {
            // Convert two 16-bit registers to a 32-bit float
            const buffer = new ArrayBuffer(4);
            const view = new DataView(buffer);
            view.setUint16(0, data[i], false);
            view.setUint16(2, data[i + 1], false);
            (result as number[]).push(view.getFloat32(0, false));
          }
        }
        break;
        
      case 'float64':
        result = [];
        for (let i = 0; i < data.length; i += 4) {
          if (i + 3 < data.length) {
            // Convert four 16-bit registers to a 64-bit float
            const buffer = new ArrayBuffer(8);
            const view = new DataView(buffer);
            view.setUint16(0, data[i], false);
            view.setUint16(2, data[i + 1], false);
            view.setUint16(4, data[i + 2], false);
            view.setUint16(6, data[i + 3], false);
            (result as number[]).push(view.getFloat64(0, false));
          }
        }
        break;
        
      case 'boolean':
        result = data.map(val => val !== 0);
        break;
        
      default:
        result = data;
    }
    
    // Apply scaling and offset
    if (typeof options.scale === 'number' || typeof options.offset === 'number') {
      const scale = options.scale || 1;
      const offset = options.offset || 0;
      
      if (Array.isArray(result)) {
        result = result.map(val => 
          typeof val === 'number' ? val * scale + offset : val
        );
      } else if (typeof result === 'number') {
        result = result * scale + offset;
      }
    }
    
    // Return single value if only one result
    if (Array.isArray(result) && result.length === 1) {
      return result[0];
    }
    
    return result;
  }

  /**
   * Handle common errors
   */
  private handleError(error: any) {
    this.connected = false;
    
    // If auto reconnect is enabled and we have a valid config, try to reconnect
    if (this.config?.autoReconnect) {
      this.scheduleReconnect();
    }
  }
}

// Export singleton instance
export const modbusClient = new ModbusClient();

// Export utility functions to simplify common operations
export async function connectDevice(config: ModbusDeviceConfig): Promise<boolean> {
  return modbusClient.connect(config);
}

export async function disconnectDevice(): Promise<void> {
  return modbusClient.disconnect();
}

export async function readModbusValue(
  dataType: ModbusDataType,
  address: number,
  options: ModbusReadOptions = {}
): Promise<number | number[] | boolean | boolean[]> {
  switch (dataType) {
    case 'coil':
      return modbusClient.readCoils(address, options.quantity || 1);
    case 'discreteInput':
      return modbusClient.readDiscreteInputs(address, options.quantity || 1);
    case 'holdingRegister':
      return modbusClient.readHoldingRegisters(address, options);
    case 'inputRegister':
      return modbusClient.readInputRegisters(address, options);
    default:
      throw new Error(`Unsupported data type: ${dataType}`);
  }
}

export async function writeModbusValue(
  dataType: 'coil' | 'holdingRegister',
  address: number,
  value: number | boolean | number[] | boolean[],
  options: ModbusWriteOptions = {}
): Promise<void> {
  if (dataType === 'coil') {
    if (Array.isArray(value)) {
      await modbusClient.writeCoils(address, value as boolean[]);
    } else {
      await modbusClient.writeCoil(address, value as boolean);
    }
  } else if (dataType === 'holdingRegister') {
    if (Array.isArray(value)) {
      await modbusClient.writeRegisters(address, value as number[], options);
    } else {
      await modbusClient.writeRegister(address, value as number, options);
    }
  } else {
    throw new Error(`Unsupported data type for writing: ${dataType}`);
  }
}
