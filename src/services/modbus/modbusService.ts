
import { ModbusDevice, ModbusReadResult, ModbusRegister, ModbusDeviceConfig } from '@/types/modbus';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Get all Modbus devices
export const getAllModbusDevices = async (): Promise<ModbusDevice[]> => {
  try {
    const { data, error } = await supabase
      .from('modbus_devices')
      .select('*');
      
    if (error) throw error;
    return data as ModbusDevice[];
  } catch (error) {
    console.error('Error fetching Modbus devices:', error);
    toast.error('Failed to fetch Modbus devices');
    return [];
  }
};

// Get a Modbus device by ID
export const getModbusDevice = async (id: string): Promise<ModbusDevice | null> => {
  try {
    const { data, error } = await supabase
      .from('modbus_devices')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) throw error;
    return data as ModbusDevice;
  } catch (error) {
    console.error('Error fetching Modbus device:', error);
    toast.error('Failed to fetch Modbus device');
    return null;
  }
};

// Create a new Modbus device
export const createModbusDevice = async (device: ModbusDeviceConfig): Promise<ModbusDevice | null> => {
  try {
    const { data, error } = await supabase
      .from('modbus_devices')
      .insert(device)
      .select()
      .single();
      
    if (error) throw error;
    toast.success('Modbus device created successfully');
    return data as ModbusDevice;
  } catch (error) {
    console.error('Error creating Modbus device:', error);
    toast.error('Failed to create Modbus device');
    return null;
  }
};

// Update a Modbus device
export const updateModbusDevice = async (id: string, device: Partial<ModbusDevice>): Promise<ModbusDevice | null> => {
  try {
    const { data, error } = await supabase
      .from('modbus_devices')
      .update(device)
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    toast.success('Modbus device updated successfully');
    return data as ModbusDevice;
  } catch (error) {
    console.error('Error updating Modbus device:', error);
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
  } catch (error) {
    console.error('Error deleting Modbus device:', error);
    toast.error('Failed to delete Modbus device');
    return false;
  }
};

// Read a Modbus register
export const readRegister = async (
  deviceId: string, 
  register: ModbusRegister
): Promise<ModbusReadResult | null> => {
  try {
    // In a real implementation, this would call the backend API
    // For now, we'll simulate a response
    const { data, error } = await supabase.functions.invoke('read-modbus-register', {
      body: { 
        deviceId, 
        registerAddress: register.register_address,
        registerType: register.register_type,
        dataType: register.data_type,
        length: register.register_length
      }
    });

    if (error) throw error;
    
    return {
      address: register.register_address,
      value: data.value,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error reading Modbus register:', error);
    toast.error('Failed to read Modbus register');
    return null;
  }
};

// Write to a Modbus register
export const writeRegister = async (
  deviceId: string, 
  register: ModbusRegister,
  value: number | boolean
): Promise<boolean> => {
  try {
    // In a real implementation, this would call the backend API
    // For now, we'll simulate a response
    const { error } = await supabase.functions.invoke('write-modbus-register', {
      body: { 
        deviceId, 
        registerAddress: register.register_address,
        registerType: register.register_type,
        dataType: register.data_type,
        value
      }
    });

    if (error) throw error;
    
    toast.success(`Value ${value} written to register ${register.register_name}`);
    return true;
  } catch (error) {
    console.error('Error writing to Modbus register:', error);
    toast.error('Failed to write to Modbus register');
    return false;
  }
};

// Get all registers for a device
export const getDeviceRegisters = async (deviceId: string): Promise<ModbusRegister[]> => {
  try {
    const { data, error } = await supabase
      .from('modbus_register_maps')
      .select('registers')
      .eq('device_id', deviceId)
      .single();
      
    if (error) throw error;
    return data?.registers || [];
  } catch (error) {
    console.error('Error fetching device registers:', error);
    toast.error('Failed to fetch device registers');
    return [];
  }
};
