import ModbusRTU from 'modbus-serial';
import { toast } from 'sonner';

// Define a type for Modbus configuration
interface ModbusConfig {
  host: string;
  port: number;
  unitId: number;
  pollIntervalMs: number;
  deviceId: string;
}

// Define a type for Modbus register mapping
interface RegisterMapping {
  register: number;
  name: string;
  type: 'holding' | 'input';
  dataType: 'uint16' | 'int16' | 'float32' | 'string' | 'boolean';
  scaleFactor?: number;
  stringLength?: number;
  addressOffset?: number;
}

// Define a type for the data returned from Modbus
interface ModbusData {
  deviceId: string;
  timestamp: string;
  metrics: Record<string, number | string | boolean>;
}

// Define a type for the Modbus client
interface ModbusClient {
  connect: () => Promise<void>;
  readData: () => Promise<ModbusData | null>;
  close: () => Promise<void>;
  isConnected: () => boolean;
}

/**
 * Creates a Modbus client for reading data from a Modbus device
 * @param config - Modbus configuration
 * @param registerMap - Mapping of registers to data points
 * @returns A Modbus client object
 */
export function createModbusClient(config: ModbusConfig, registerMap: RegisterMapping[]): ModbusClient {
  const { host, port, unitId, deviceId } = config;
  const client = new ModbusRTU();
  let connected = false;

  // Function to connect to the Modbus device
  const connect = async (): Promise<void> => {
    try {
      await client.connectTCP(host, { port });
      client.setID(unitId);
      connected = true;
      console.log(`Connected to Modbus TCP device: ${host}:${port} Unit ID: ${unitId}`);
      toast.success(`Connected to Modbus TCP device: ${host}:${port}`);
    } catch (err) {
      connected = false;
      console.error(`Modbus TCP connection error: ${err}`);
      toast.error(`Modbus TCP connection error: ${err}`);
      throw err;
    }
  };

  // Function to read data from the Modbus device
  const readData = async (): Promise<ModbusData | null> => {
    if (!connected) {
      console.warn('Modbus client is not connected. Call connect() first.');
      toast.error('Modbus client is not connected. Call connect() first.');
      return null;
    }

    const metrics: Record<string, number | string | boolean> = {};

    try {
      for (const mapping of registerMap) {
        let response;
        
        if (mapping.type === 'holding') {
          response = await client.readHoldingRegisters(mapping.register, mapping.dataType === 'string' ? mapping.stringLength || 16 : 1);
        } else {
          response = await client.readInputRegisters(mapping.register, mapping.dataType === 'string' ? mapping.stringLength || 16 : 1);
        }

        if (response && response.data) {
          let data = response.data;

          if (mapping.dataType === 'float32') {
            // Assuming ModbusRTU returns an array of two 16-bit words that need to be combined into a 32-bit float
            if (data.length >= 2) {
              const buffer = Buffer.alloc(4);
              buffer.writeUInt16BE(data[0], 0);
              buffer.writeUInt16BE(data[1], 2);
              const floatValue = buffer.readFloatBE(0);
              metrics[mapping.name] = mapping.scaleFactor ? floatValue * mapping.scaleFactor : floatValue;
            } else {
              console.warn(`Not enough data to form a float32 for ${mapping.name}`);
            }
          } else if (mapping.dataType === 'uint16' || mapping.dataType === 'int16') {
            const rawValue = data[0];
            metrics[mapping.name] = mapping.scaleFactor ? rawValue * mapping.scaleFactor : rawValue;
          } else if (mapping.dataType === 'string') {
            // Handle string data
            if (Array.isArray(data)) {
              const stringValue = data.map(charCode => String.fromCharCode(charCode)).join('');
              metrics[mapping.name] = stringValue.trim();
            } else {
              console.warn(`Unexpected data format for string at register ${mapping.register}`);
              metrics[mapping.name] = String(data);
            }
          } else if (mapping.dataType === 'boolean') {
            // The specific line with the error (483)
            // Change the boolean[] to number[] by converting boolean values to numbers
            const numericData = data.map(value => value ? 1 : 0);
            metrics[mapping.name] = numericData;
          }
        } else {
          console.warn(`No data received for register ${mapping.register}`);
        }
      }

      const modbusData: ModbusData = {
        deviceId: deviceId,
        timestamp: new Date().toISOString(),
        metrics: metrics,
      };

      return modbusData;
    } catch (err) {
      console.error(`Error reading Modbus data: ${err}`);
      toast.error(`Error reading Modbus data: ${err}`);
      return null;
    }
  };

  // Function to close the Modbus connection
  const close = async (): Promise<void> => {
    try {
      await client.close();
      connected = false;
      console.log('Modbus connection closed.');
    } catch (err) {
      console.error(`Error closing Modbus connection: ${err}`);
    }
  };

  // Function to check if the client is connected
  const isConnected = (): boolean => {
    return connected;
  };

  return { connect, readData, close, isConnected };
}
