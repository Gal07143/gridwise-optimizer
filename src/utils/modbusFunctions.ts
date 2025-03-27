
// Mock implementation since we can't import modbus-serial

// Define a type that can be used in place of ModbusRTU
type MockModbusRTU = {
  connectRTUBuffered: (port: string, options: any) => Promise<void>;
  setTimeout: (timeout: number) => void;
  setID: (id: number) => void;
  readHoldingRegisters: (addr: number, len: number) => Promise<{ data: number[] }>;
  close: () => Promise<void>;
};

// Mock ModbusRTU class
class MockModbusRTU implements MockModbusRTU {
  constructor() {}
  
  async connectRTUBuffered(port: string, options: any) {
    console.log(`Mock connecting to ${port} with options:`, options);
    return Promise.resolve();
  }
  
  setTimeout(timeout: number) {
    console.log(`Mock setting timeout to ${timeout}ms`);
  }
  
  setID(id: number) {
    console.log(`Mock setting ID to ${id}`);
  }
  
  async readHoldingRegisters(addr: number, len: number) {
    console.log(`Mock reading ${len} holding registers from address ${addr}`);
    // Return mock data
    const mockData = Array(len).fill(0).map((_, i) => i + 100);
    return Promise.resolve({ data: mockData });
  }
  
  async close() {
    console.log('Mock closing connection');
    return Promise.resolve();
  }
}

export function createModbusClient() {
  return new MockModbusRTU();
}

// Mock the Supabase connection for Modbus data
export async function saveModbusReadingToSupabase(deviceId: string, data: any) {
  console.log(`Mock saving modbus reading for device ${deviceId}`, data);
  return Promise.resolve({ success: true });
}
