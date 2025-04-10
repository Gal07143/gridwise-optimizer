
import { 
  ModbusDevice, 
  ModbusRegister, 
  ModbusReadingResult,
  ModbusWriteResult,
  ModbusRegisterMap,
} from '@/types/modbus';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Get all Modbus devices
export const getAllModbusDevices = async (): Promise<ModbusDevice[]> => {
  try {
    const { data, error } = await supabase
      .from('modbus_devices')
      .select('*');

    if (error) throw error;

    // Convert database fields to match our ModbusDevice interface
    return (data as any[]).map(device => ({
      id: device.id,
      name: device.name,
      ip_address: device.ip || device.ip_address,
      ip: device.ip || device.ip_address,
      port: device.port,
      slave_id: device.slave_id || device.unit_id,
      unit_id: device.unit_id || device.slave_id, 
      status: device.status || 'offline',
      created_at: device.created_at || device.inserted_at,
      inserted_at: device.inserted_at || device.created_at,
      updated_at: device.updated_at,
      protocol: device.protocol || 'TCP',
      description: device.description,
      is_active: device.is_active !== undefined ? device.is_active : true
    }));
  } catch (error) {
    console.error('Error fetching Modbus devices:', error);
    throw error;
  }
};

// Alias for backward compatibility
export const getModbusDevices = getAllModbusDevices;

// Get a single Modbus device by ID
export const getModbusDeviceById = async (deviceId: string): Promise<ModbusDevice | null> => {
  try {
    const { data, error } = await supabase
      .from('modbus_devices')
      .select('*')
      .eq('id', deviceId)
      .single();

    if (error) throw error;

    // Convert to match our interface
    return {
      id: data.id,
      name: data.name,
      ip_address: data.ip || data.ip_address,
      ip: data.ip || data.ip_address,
      port: data.port,
      slave_id: data.slave_id || data.unit_id,
      unit_id: data.unit_id || data.slave_id,
      status: data.status || 'offline',
      created_at: data.created_at || data.inserted_at,
      updated_at: data.updated_at,
      protocol: data.protocol || 'TCP',
      description: data.description,
      is_active: data.is_active !== undefined ? data.is_active : true
    };
  } catch (error) {
    console.error('Error fetching Modbus device by ID:', error);
    return null;
  }
};

// Create a new Modbus device
export const createModbusDevice = async (device: Partial<ModbusDevice>): Promise<ModbusDevice | null> => {
  try {
    const { data, error } = await supabase
      .from('modbus_devices')
      .insert({
        name: device.name,
        ip: device.ip_address || device.ip,
        port: device.port || 502,
        unit_id: device.slave_id || device.unit_id || 1,
        protocol: device.protocol || 'TCP',
        description: device.description
      })
      .select('*')
      .single();

    if (error) throw error;

    toast.success("Modbus device created successfully");
    return data as ModbusDevice;
  } catch (error) {
    console.error('Error creating Modbus device:', error);
    toast.error("Failed to create Modbus device");
    return null;
  }
};

// Update a Modbus device
export const updateModbusDevice = async (deviceId: string, device: Partial<ModbusDevice>): Promise<ModbusDevice | null> => {
  try {
    const { data, error } = await supabase
      .from('modbus_devices')
      .update({
        name: device.name,
        ip: device.ip_address || device.ip,
        port: device.port,
        unit_id: device.slave_id || device.unit_id,
        protocol: device.protocol,
        description: device.description,
        is_active: device.is_active
      })
      .eq('id', deviceId)
      .select('*')
      .single();

    if (error) throw error;

    toast.success("Modbus device updated successfully");
    return data as ModbusDevice;
  } catch (error) {
    console.error('Error updating Modbus device:', error);
    toast.error("Failed to update Modbus device");
    return null;
  }
};

// Read a Modbus register
export const readRegister = async (deviceId: string, register: ModbusRegister): Promise<ModbusReadingResult> => {
  try {
    const device = await getModbusDeviceById(deviceId);
    
    if (!device) {
      return {
        address: register.register_address,
        value: 0,
        timestamp: new Date().toISOString(),
        formattedValue: 'Device not found',
        success: false
      };
    }

    // In a real implementation, this would make an API call to read the register
    // For now, we'll simulate a successful read with random data
    const value = Math.random() * 100;
    
    // Format the value based on register type
    let formattedValue = String(value.toFixed(2));
    
    if (register.register_name.toLowerCase().includes('temperature')) {
      formattedValue = `${value.toFixed(1)} °C`;
    } else if (register.register_name.toLowerCase().includes('power')) {
      formattedValue = `${value.toFixed(0)} W`;
    } else if (register.register_name.toLowerCase().includes('energy')) {
      formattedValue = `${value.toFixed(1)} kWh`;
    } else if (register.register_name.toLowerCase().includes('voltage')) {
      formattedValue = `${value.toFixed(1)} V`;
    } else if (register.register_name.toLowerCase().includes('current')) {
      formattedValue = `${value.toFixed(2)} A`;
    } else if (register.register_name.toLowerCase().includes('frequency')) {
      formattedValue = `${value.toFixed(2)} Hz`;
    }
    
    // Apply scaling factor if available
    const scaledValue = register.scaleFactor ? value * register.scaleFactor : value;
    
    return {
      address: register.register_address,
      value: scaledValue,
      timestamp: new Date().toISOString(),
      formattedValue: formattedValue,
      success: true
    };
  } catch (error) {
    console.error('Error reading Modbus register:', error);
    return {
      address: register.register_address,
      value: 0,
      timestamp: new Date().toISOString(),
      formattedValue: 'Error',
      success: false
    };
  }
};

// Write to a Modbus register
export const writeRegister = async (
  deviceId: string,
  register: ModbusRegister,
  value: number | boolean
): Promise<ModbusWriteResult> => {
  try {
    // In a real implementation, this would make an API call to write to the register
    console.log(`Writing value ${value} to register ${register.register_address} on device ${deviceId}`);
    
    // Simulate a successful write
    return {
      success: true,
      message: `Value ${value} written to register ${register.register_address}`,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error writing to Modbus register:', error);
    return {
      success: false,
      message: `Failed to write to register: ${error}`,
      timestamp: new Date().toISOString()
    };
  }
};

// Get all register mappings for a device
export const getRegisterMap = async (deviceId: string): Promise<ModbusRegisterMap | null> => {
  try {
    const { data, error } = await supabase
      .from('modbus_register_maps')
      .select('*')
      .eq('device_id', deviceId)
      .single();
      
    if (error) throw error;
    
    return data as ModbusRegisterMap;
  } catch (error) {
    console.error('Error fetching register map:', error);
    return null;
  }
};

// Get all registers for a device
export const getDeviceRegisters = async (deviceId: string): Promise<ModbusRegister[]> => {
  try {
    const { data, error } = await supabase
      .from('modbus_registers')
      .select('*')
      .eq('device_id', deviceId);
      
    if (error) throw error;

    return data.map(register => ({
      name: register.register_name,
      address: register.register_address,
      register_address: register.register_address,
      register_name: register.register_name,
      register_length: register.register_length,
      scaleFactor: register.scaling_factor,
      register_type: 'holding',  // Default values for compatibility
      data_type: 'float'         // Default values for compatibility
    }));
  } catch (error) {
    console.error('Error fetching device registers:', error);
    return [];
  }
};
