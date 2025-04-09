
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  ModbusDevice, 
  ModbusRegister, 
  ModbusReadResult,
  ModbusReadingResult,
  ModbusWriteResult
} from '@/types/modbus';

// Get all Modbus devices
export const getModbusDevices = async (): Promise<ModbusDevice[]> => {
  try {
    const { data, error } = await supabase
      .from('modbus_devices')
      .select('*')
      .order('name');
      
    if (error) throw error;
    return data || [];
  } catch (error: any) {
    console.error('Error fetching Modbus devices:', error);
    toast.error('Failed to load Modbus devices');
    return [];
  }
};

// Get a specific Modbus device by ID
export const getModbusDeviceById = async (id: string): Promise<ModbusDevice | null> => {
  try {
    const { data, error } = await supabase
      .from('modbus_devices')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error(`Error fetching Modbus device ${id}:`, error);
    toast.error('Failed to load Modbus device details');
    return null;
  }
};

// Create a new Modbus device
export const createModbusDevice = async (device: Omit<ModbusDevice, 'id' | 'created_at' | 'status'>): Promise<ModbusDevice | null> => {
  try {
    const { data, error } = await supabase
      .from('modbus_devices')
      .insert({ 
        ...device, 
        status: 'offline' 
      })
      .select()
      .single();
      
    if (error) throw error;
    
    toast.success('Modbus device created successfully');
    return data;
  } catch (error: any) {
    console.error('Error creating Modbus device:', error);
    toast.error('Failed to create Modbus device');
    return null;
  }
};

// Update a Modbus device
export const updateModbusDevice = async (id: string, updates: Partial<ModbusDevice>): Promise<ModbusDevice | null> => {
  try {
    const { data, error } = await supabase
      .from('modbus_devices')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    
    toast.success('Modbus device updated successfully');
    return data;
  } catch (error: any) {
    console.error(`Error updating Modbus device ${id}:`, error);
    toast.error('Failed to update Modbus device');
    return null;
  }
};

// Delete a Modbus device
export const deleteModbusDevice = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('modbus_devices')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    
    toast.success('Modbus device deleted successfully');
    return true;
  } catch (error: any) {
    console.error(`Error deleting Modbus device ${id}:`, error);
    toast.error('Failed to delete Modbus device');
    return false;
  }
};

// Read a register from a Modbus device
export const readRegister = async (
  deviceId: string, 
  register: ModbusRegister
): Promise<ModbusReadingResult> => {
  try {
    const { data, error } = await supabase.functions.invoke('read-modbus-register', {
      body: { 
        deviceId, 
        register: {
          address: register.register_address,
          type: register.register_type,
          dataType: register.data_type,
          length: register.register_length
        }
      }
    });
    
    if (error) throw error;
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to read register');
    }
    
    return {
      address: register.register_address,
      value: data.value,
      timestamp: new Date().toISOString(),
      formattedValue: formatValue(data.value, register),
      success: true
    };
  } catch (error: any) {
    console.error(`Error reading register ${register.register_name}:`, error);
    return {
      address: register.register_address,
      value: 0,
      timestamp: new Date().toISOString(),
      success: false
    };
  }
};

// Write to a register on a Modbus device
export const writeRegister = async (
  deviceId: string,
  register: ModbusRegister,
  value: number | boolean
): Promise<ModbusWriteResult> => {
  try {
    const { data, error } = await supabase.functions.invoke('write-modbus-register', {
      body: { 
        deviceId, 
        register: {
          address: register.register_address,
          type: register.register_type,
          dataType: register.data_type,
          length: register.register_length
        },
        value
      }
    });
    
    if (error) throw error;
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to write to register');
    }
    
    toast.success(`Value written to ${register.register_name} successfully`);
    
    return {
      success: true,
      timestamp: new Date().toISOString()
    };
  } catch (error: any) {
    console.error(`Error writing to register ${register.register_name}:`, error);
    toast.error('Failed to write to register');
    
    return {
      success: false,
      message: error.message,
      timestamp: new Date().toISOString()
    };
  }
};

// Helper function to format register values based on data type
const formatValue = (value: any, register: ModbusRegister): string => {
  if (register.data_type === 'boolean') {
    return value ? 'ON' : 'OFF';
  }
  
  const scaledValue = register.scaleFactor ? value * register.scaleFactor : value;
  
  // Format based on likely units
  if (register.register_name.toLowerCase().includes('temp')) {
    return `${scaledValue.toFixed(1)}°C`;
  } else if (register.register_name.toLowerCase().includes('power')) {
    return `${scaledValue.toFixed(2)} kW`;
  } else if (register.register_name.toLowerCase().includes('energy')) {
    return `${scaledValue.toFixed(2)} kWh`;
  } else if (register.register_name.toLowerCase().includes('voltage')) {
    return `${scaledValue.toFixed(1)} V`;
  } else if (register.register_name.toLowerCase().includes('current')) {
    return `${scaledValue.toFixed(2)} A`;
  } else if (register.register_name.toLowerCase().includes('frequency')) {
    return `${scaledValue.toFixed(1)} Hz`;
  }
  
  // Default formatting
  return `${scaledValue}`;
};

// Get register map for a device
export const getRegisterMap = async (deviceId: string): Promise<ModbusRegister[]> => {
  try {
    const { data, error } = await supabase
      .from('modbus_register_maps')
      .select('registers')
      .eq('device_id', deviceId)
      .single();
      
    if (error) throw error;
    
    return data?.registers || [];
  } catch (error: any) {
    console.error(`Error fetching register map for device ${deviceId}:`, error);
    return [];
  }
};
