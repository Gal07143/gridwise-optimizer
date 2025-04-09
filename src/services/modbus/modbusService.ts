
import { supabase } from '@/integrations/supabase/client';
import { ModbusDeviceConfig, ModbusRegisterDefinition, ModbusReadingResult } from '@/types/modbus';
import { toast } from 'sonner';

export const getAllModbusDevices = async (): Promise<ModbusDeviceConfig[]> => {
  try {
    const { data, error } = await supabase
      .from('modbus_devices')
      .select('*');

    if (error) throw error;
    
    // Map database results to our app model, ensuring all required properties exist
    return (data || []).map(device => ({
      id: device.id,
      name: device.name,
      ip: device.ip,
      ip_address: device.ip_address || device.ip, // For compatibility
      port: device.port,
      unit_id: device.unit_id,
      protocol: device.protocol as "tcp" | "rtu",
      is_active: device.is_active,
      description: device.description,
      site_id: device.site_id,
      updated_at: device.updated_at
    }));

  } catch (error) {
    console.error('Error fetching Modbus devices:', error);
    toast.error('Failed to fetch Modbus devices');
    return [];
  }
};

export const getModbusDeviceById = async (id: string): Promise<ModbusDeviceConfig | null> => {
  try {
    const { data, error } = await supabase
      .from('modbus_devices')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    
    // Map database result to our app model
    return {
      id: data.id,
      name: data.name,
      ip: data.ip,
      ip_address: data.ip_address || data.ip, // For compatibility
      port: data.port,
      unit_id: data.unit_id,
      protocol: data.protocol as "tcp" | "rtu",
      is_active: data.is_active,
      description: data.description,
      site_id: data.site_id,
      updated_at: data.updated_at
    };

  } catch (error) {
    console.error(`Error fetching Modbus device with ID ${id}:`, error);
    toast.error('Failed to fetch Modbus device');
    return null;
  }
};

export const createModbusDevice = async (deviceData: Partial<ModbusDeviceConfig>): Promise<ModbusDeviceConfig | null> => {
  try {
    // Clone device data and ensure proper naming
    let insertData = { ...deviceData };
    
    // Default ip_address to ip if not provided
    if (!insertData.ip_address && insertData.ip) {
      insertData.ip_address = insertData.ip;
    }
    
    const { data, error } = await supabase
      .from('modbus_devices')
      .insert({
        name: insertData.name,
        ip: insertData.ip,
        port: insertData.port,
        unit_id: insertData.unit_id,
        protocol: insertData.protocol,
        is_active: insertData.is_active !== undefined ? insertData.is_active : true,
        description: insertData.description,
        site_id: insertData.site_id,
      })
      .select()
      .single();

    if (error) throw error;
    
    // Add ip_address alias for compatibility
    return {
      ...data,
      ip_address: data.ip
    };

  } catch (error) {
    console.error('Error creating Modbus device:', error);
    toast.error('Failed to create Modbus device');
    return null;
  }
};

export const updateModbusDevice = async (id: string, deviceData: Partial<ModbusDeviceConfig>): Promise<ModbusDeviceConfig | null> => {
  try {
    // Clone device data and ensure proper naming
    const updateData = { ...deviceData };
    
    // Handle ip_address to ip conversion if needed
    if (updateData.ip_address && !updateData.ip) {
      updateData.ip = updateData.ip_address;
    } else if (updateData.ip && !updateData.ip_address) {
      updateData.ip_address = updateData.ip;
    }
    
    const { data, error } = await supabase
      .from('modbus_devices')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    
    // Add ip_address alias for compatibility
    return {
      ...data,
      ip_address: data.ip
    };

  } catch (error) {
    console.error(`Error updating Modbus device with ID ${id}:`, error);
    toast.error('Failed to update Modbus device');
    return null;
  }
};

export const readModbusRegister = async (device: ModbusDeviceConfig, register: ModbusRegisterDefinition): Promise<ModbusReadingResult> => {
  try {
    // This is a mock implementation since we can't actually connect to Modbus devices in this web app
    // In a real implementation, this would make an API call to a backend service
    
    // Simulate a successful read with random data
    const value = Math.floor(Math.random() * 100);
    
    return {
      address: register.address,
      value: value,
      formattedValue: `${value} ${register.unit || ''}`,
      timestamp: new Date().toISOString(),
      success: true
    };
  } catch (error) {
    console.error(`Error reading Modbus register ${register.address} from device ${device.name}:`, error);
    
    return {
      address: register.address,
      value: 0,
      formattedValue: 'Error',
      timestamp: new Date().toISOString(),
      success: false,
      error: error instanceof Error ? error : new Error('Failed to read register')
    };
  }
};

export const deleteModbusDevice = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('modbus_devices')
      .delete()
      .eq('id', id);

    if (error) throw error;
    
    toast.success('Modbus device deleted successfully');
    return true;
  } catch (error) {
    console.error(`Error deleting Modbus device with ID ${id}:`, error);
    toast.error('Failed to delete Modbus device');
    return false;
  }
};
