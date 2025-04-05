
import { supabase } from '@/integrations/supabase/client';
import { ModbusDevice } from '@/types/modbus';
import { toast } from 'sonner';

/**
 * Get a modbus device by ID
 */
export const getModbusDeviceById = async (deviceId: string): Promise<ModbusDevice | null> => {
  try {
    console.log('Fetching Modbus device with ID:', deviceId);
    
    const { data, error } = await supabase
      .from('modbus_devices')
      .select('*')
      .eq('id', deviceId)
      .single();
    
    if (error) {
      throw error;
    }
    
    if (!data) {
      console.log('No Modbus device found with ID:', deviceId);
      return null;
    }
    
    console.log('Modbus device found:', data);
    
    // Convert to our application's device type
    const device: ModbusDevice = {
      ...data,
      // Ensure all required properties are present
      protocol: data.protocol || 'TCP',
      description: data.description || '',
      serialPort: data.serial_port,
      baudRate: data.baud_rate,
      host: data.ip || data.host
    };
    
    return device;
    
  } catch (error: any) {
    console.error('Error fetching modbus device:', error);
    toast.error(`Failed to fetch modbus device: ${error.message || 'Unknown error'}`);
    return null;
  }
};

/**
 * Update a modbus device
 */
export const updateModbusDevice = async (deviceId: string, deviceData: Partial<ModbusDevice>): Promise<ModbusDevice | null> => {
  try {
    const { data, error } = await supabase
      .from('modbus_devices')
      .update({
        name: deviceData.name,
        ip: deviceData.ip,
        port: deviceData.port,
        unit_id: deviceData.unit_id,
        protocol: deviceData.protocol,
        description: deviceData.description,
        is_active: deviceData.is_active
      })
      .eq('id', deviceId)
      .select()
      .single();
      
    if (error) {
      throw error;
    }
    
    toast.success('Modbus device updated successfully');
    return data as ModbusDevice;
    
  } catch (error: any) {
    console.error('Error updating modbus device:', error);
    toast.error(`Failed to update modbus device: ${error.message || 'Unknown error'}`);
    return null;
  }
};

/**
 * Create a new modbus device
 */
export const createModbusDevice = async (deviceData: Omit<ModbusDevice, 'id'>): Promise<ModbusDevice | null> => {
  try {
    const { data, error } = await supabase
      .from('modbus_devices')
      .insert({
        name: deviceData.name,
        ip: deviceData.ip,
        port: deviceData.port,
        unit_id: deviceData.unit_id,
        protocol: deviceData.protocol || 'TCP',
        description: deviceData.description || null,
        is_active: deviceData.is_active !== undefined ? deviceData.is_active : true
      })
      .select()
      .single();
      
    if (error) {
      throw error;
    }
    
    toast.success('Modbus device created successfully');
    return data as ModbusDevice;
    
  } catch (error: any) {
    console.error('Error creating modbus device:', error);
    toast.error(`Failed to create modbus device: ${error.message || 'Unknown error'}`);
    return null;
  }
};

/**
 * Delete a modbus device
 */
export const deleteModbusDevice = async (deviceId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('modbus_devices')
      .delete()
      .eq('id', deviceId);
      
    if (error) {
      throw error;
    }
    
    toast.success('Modbus device deleted successfully');
    return true;
    
  } catch (error: any) {
    console.error('Error deleting modbus device:', error);
    toast.error(`Failed to delete modbus device: ${error.message || 'Unknown error'}`);
    return false;
  }
};

/**
 * Get all modbus devices
 */
export const getAllModbusDevices = async (): Promise<ModbusDevice[]> => {
  try {
    const { data, error } = await supabase
      .from('modbus_devices')
      .select('*')
      .order('name');
      
    if (error) {
      throw error;
    }
    
    return data as ModbusDevice[];
    
  } catch (error: any) {
    console.error('Error fetching modbus devices:', error);
    toast.error(`Failed to fetch modbus devices: ${error.message || 'Unknown error'}`);
    return [];
  }
};
