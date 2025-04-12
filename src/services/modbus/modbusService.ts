
import { ModbusDevice, ModbusRegister, ModbusOperationResult } from '@/types/modbus';

// Mock implementation for a Modbus service
export const readRegister = async (
  deviceId: string, 
  address: number, 
  registerType: string = 'holding'
): Promise<ModbusOperationResult> => {
  // In a real app, this would connect to the device and read the register
  console.log(`Reading ${registerType} register ${address} from device ${deviceId}`);
  
  // Simulate some realistic values based on register address
  let value;
  
  switch (address % 10) {
    case 0: // Voltage
      value = 220 + Math.random() * 10;
      break;
    case 1: // Current
      value = 5 + Math.random() * 10;
      break;
    case 2: // Power
      value = 1000 + Math.random() * 500;
      break;
    case 3: // Frequency
      value = 50 + Math.random() * 0.2;
      break;
    case 4: // Temperature
      value = 25 + Math.random() * 15;
      break;
    case 5: // State of charge
      value = Math.random() * 100;
      break;
    default:
      value = Math.random() * 1000;
  }
  
  return {
    success: true,
    value: Math.round(value * 100) / 100
  };
};

export const writeRegister = async (
  deviceId: string, 
  address: number, 
  value: number | boolean,
  registerType: string = 'holding'
): Promise<ModbusOperationResult> => {
  // In a real app, this would connect to the device and write to the register
  console.log(`Writing value ${value} to ${registerType} register ${address} on device ${deviceId}`);
  
  // Simulate success or occasional failure
  const success = Math.random() > 0.1; // 90% success rate
  
  return {
    success,
    error: success ? undefined : 'Communication timeout'
  };
};

export const createModbusDevice = async (device: Partial<ModbusDevice>): Promise<ModbusDevice> => {
  // In a real app, this would create a device in the database
  const newDevice: ModbusDevice = {
    id: `device-${Date.now()}`,
    name: device.name || 'New Modbus Device',
    ip_address: device.ip_address,
    port: device.port || 502,
    unit_id: device.unit_id || 1,
    protocol: device.protocol || 'tcp',
    description: device.description,
    created_at: new Date().toISOString(),
    status: 'offline'
  };
  
  console.log('Created Modbus device:', newDevice);
  
  return newDevice;
};

// Get all Modbus devices
export const getAllModbusDevices = async (): Promise<ModbusDevice[]> => {
  // In a real app, this would fetch from the database
  const mockDevices: ModbusDevice[] = [
    {
      id: 'device-1',
      name: 'Inverter',
      ip_address: '192.168.1.100',
      port: 502,
      unit_id: 1,
      protocol: 'tcp',
      description: 'Solar inverter',
      created_at: new Date().toISOString(),
      status: 'online'
    },
    {
      id: 'device-2',
      name: 'Battery System',
      ip_address: '192.168.1.101',
      port: 502,
      unit_id: 1,
      protocol: 'tcp',
      description: 'Energy storage',
      created_at: new Date().toISOString(),
      status: 'offline'
    }
  ];
  
  return mockDevices;
};

// Get a specific Modbus device by ID
export const getModbusDeviceById = async (deviceId: string): Promise<ModbusDevice | null> => {
  // In a real app, this would fetch from the database
  const mockDevices = await getAllModbusDevices();
  const device = mockDevices.find(d => d.id === deviceId);
  
  // If the device isn't in our mock data but it's a valid ID, generate one
  if (!device && deviceId) {
    return {
      id: deviceId,
      name: `Device ${deviceId.substring(0, 5)}`,
      ip_address: '192.168.1.100',
      port: 502,
      unit_id: 1,
      protocol: 'tcp',
      description: 'Generated device',
      created_at: new Date().toISOString(),
      status: Math.random() > 0.3 ? 'online' : 'offline'
    };
  }
  
  return device || null;
};

// Get the registers associated with a specific device ID
export const getDeviceRegisters = async (deviceId: string): Promise<ModbusRegister[]> => {
  console.log(`Fetching registers for device ${deviceId}`);
  
  // In a real app, this would fetch from a database or device template
  const registers: ModbusRegister[] = [];
  
  // Generate some sample registers
  for (let i = 0; i < 10; i++) {
    const address = 40001 + i * 2;
    let name = '';
    let dataType = 'float32';
    let unit = '';
    
    switch (i) {
      case 0:
        name = 'Voltage';
        unit = 'V';
        break;
      case 1:
        name = 'Current';
        unit = 'A';
        break;
      case 2:
        name = 'Power';
        unit = 'W';
        break;
      case 3:
        name = 'Frequency';
        unit = 'Hz';
        break;
      case 4:
        name = 'Temperature';
        unit = '°C';
        break;
      case 5:
        name = 'State of Charge';
        unit = '%';
        break;
      default:
        name = `Register ${i}`;
        break;
    }
    
    registers.push({
      id: `reg-${deviceId}-${i}`,
      device_id: deviceId,
      register_address: address,
      register_name: name,
      register_type: 'holding',
      data_type: dataType as any,
      register_length: 2,
      scaleFactor: 1,
      unit,
      description: `${name} register`,
      access: i < 7 ? 'read' : 'read/write'
    });
  }
  
  return registers;
};

// Update a Modbus device
export const updateModbusDevice = async (device: ModbusDevice): Promise<ModbusDevice> => {
  console.log(`Updating Modbus device ${device.id}`);
  // In a real app, this would update the database
  return {
    ...device,
    last_updated: new Date().toISOString()
  };
};

// Read multiple registers at once
export const readMultipleRegisters = async (
  deviceId: string,
  startAddress: number,
  count: number,
  registerType: string = 'holding'
): Promise<ModbusOperationResult> => {
  console.log(`Reading ${count} ${registerType} registers starting at ${startAddress} from device ${deviceId}`);
  
  // Simulate reading multiple values
  const values = Array(count).fill(0).map((_, i) => {
    const address = startAddress + i;
    switch (address % 10) {
      case 0: return 220 + Math.random() * 10;
      case 1: return 5 + Math.random() * 10;
      case 2: return 1000 + Math.random() * 500;
      case 3: return 50 + Math.random() * 0.2;
      case 4: return 25 + Math.random() * 15;
      case 5: return Math.random() * 100;
      default: return Math.random() * 1000;
    }
  });
  
  return {
    success: true,
    value: values.map(v => Math.round(v * 100) / 100)
  };
};

// Write multiple registers at once
export const writeMultipleRegisters = async (
  deviceId: string,
  startAddress: number,
  values: number[],
  registerType: string = 'holding'
): Promise<ModbusOperationResult> => {
  console.log(`Writing ${values.length} values to ${registerType} registers starting at ${startAddress} on device ${deviceId}`);
  
  // Simulate success or occasional failure
  const success = Math.random() > 0.1; // 90% success rate
  
  return {
    success,
    error: success ? undefined : 'Communication timeout'
  };
};

// Get device status
export const getDeviceStatus = async (deviceId: string): Promise<'online' | 'offline' | 'error'> => {
  // In a real app, this would ping the device or check its last communication timestamp
  const statuses: ('online' | 'offline' | 'error')[] = ['online', 'offline', 'error'];
  const randomIndex = Math.floor(Math.random() * 10);
  
  // Make online more likely
  if (randomIndex < 7) return 'online';
  if (randomIndex < 9) return 'offline';
  return 'error';
};

// Scan for Modbus devices on the network
export const scanForDevices = async (
  startIp: string,
  endIp: string,
  port: number = 502
): Promise<ModbusDevice[]> => {
  console.log(`Scanning for Modbus devices from ${startIp} to ${endIp} on port ${port}`);
  
  // In a real app, this would scan the network for Modbus devices
  // Here we just return some mock devices
  const devices: ModbusDevice[] = [];
  
  // Generate 0-3 random devices
  const count = Math.floor(Math.random() * 4);
  
  for (let i = 0; i < count; i++) {
    const lastOctet = 100 + i;
    devices.push({
      id: `scan-${Date.now()}-${i}`,
      name: `Discovered Device ${i + 1}`,
      ip_address: `192.168.1.${lastOctet}`,
      port,
      unit_id: 1,
      protocol: 'tcp',
      status: 'online'
    });
  }
  
  return devices;
};

// Import registers from a CSV file
export const importRegistersFromCsv = async (
  deviceId: string,
  csvContent: string
): Promise<ModbusRegister[]> => {
  console.log(`Importing registers for device ${deviceId} from CSV`);
  
  // In a real app, this would parse the CSV and create registers
  // Here we just create some sample registers
  const lines = csvContent.trim().split('\n');
  const registers: ModbusRegister[] = [];
  
  // Skip header row if present
  const startIndex = lines[0].includes('address') || lines[0].includes('name') ? 1 : 0;
  
  for (let i = startIndex; i < lines.length; i++) {
    const parts = lines[i].split(',');
    if (parts.length < 3) continue;
    
    const name = parts[0].trim();
    const address = parseInt(parts[1].trim(), 10);
    const dataType = parts[2].trim();
    
    registers.push({
      id: `reg-import-${Date.now()}-${i}`,
      device_id: deviceId,
      register_address: address,
      register_name: name,
      register_type: 'holding',
      data_type: dataType as any,
      register_length: dataType.includes('32') ? 2 : 1,
      scaleFactor: 1,
      unit: parts[3]?.trim() || '',
      description: parts[4]?.trim() || '',
      access: 'read'
    });
  }
  
  return registers;
};

// Export registers to CSV format
export const exportRegistersToCsv = async (registers: ModbusRegister[]): Promise<string> => {
  console.log(`Exporting ${registers.length} registers to CSV`);
  
  // Create CSV header
  let csv = 'Name,Address,Data Type,Unit,Description,Access\n';
  
  // Add each register as a row
  registers.forEach(reg => {
    csv += `${reg.register_name},${reg.register_address},${reg.data_type},${reg.unit || ''},${reg.description || ''},${reg.access || 'read'}\n`;
  });
  
  return csv;
};

// Get register map for a device
export const getRegisterMap = async (deviceId: string): Promise<ModbusRegister[]> => {
  // This would normally fetch from a database
  // For now, we'll generate some sample registers
  const registers: ModbusRegister[] = [];
  
  // Common registers for different device types
  const registerTemplates = [
    { name: 'Voltage', address: 40001, register_address: 40001, register_name: 'Voltage', register_type: 'holding', data_type: 'float', register_length: 2, scaleFactor: 0.1, unit: 'V' },
    { name: 'Current', address: 40003, register_address: 40003, register_name: 'Current', register_type: 'holding', data_type: 'float', register_length: 2, scaleFactor: 0.01, unit: 'A' },
    { name: 'Power', address: 40005, register_address: 40005, register_name: 'Power', register_type: 'holding', data_type: 'float', register_length: 2, scaleFactor: 1, unit: 'W' },
    { name: 'Energy', address: 40007, register_address: 40007, register_name: 'Energy', register_type: 'holding', data_type: 'float', register_length: 2, scaleFactor: 0.1, unit: 'kWh' },
    { name: 'Frequency', address: 40009, register_address: 40009, register_name: 'Frequency', register_type: 'holding', data_type: 'float', register_length: 2, scaleFactor: 0.01, unit: 'Hz' },
    { name: 'Power Factor', address: 40011, register_address: 40011, register_name: 'Power Factor', register_type: 'holding', data_type: 'float', register_length: 2, scaleFactor: 0.001 },
    { name: 'Temperature', address: 40013, register_address: 40013, register_name: 'Temperature', register_type: 'holding', data_type: 'float', register_length: 2, scaleFactor: 0.1, unit: '°C' },
    { name: 'Status', address: 40015, register_address: 40015, register_name: 'Status', register_type: 'holding', data_type: 'float', register_length: 2, scaleFactor: 1 }
  ];
  
  // Add each register template to the result
  registerTemplates.forEach((template, index) => {
    registers.push({
      id: `reg-${deviceId}-${index}`,
      device_id: deviceId,
      register_address: template.register_address,
      register_name: template.register_name,
      register_type: template.register_type as any,
      data_type: template.data_type as any,
      register_length: template.register_length,
      scaleFactor: template.scaleFactor,
      unit: template.unit,
      description: `${template.name} measurement`,
      access: 'read'
    });
  });
  
  return registers;
};
