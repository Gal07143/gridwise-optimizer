import { ModbusDevice, ModbusRegister, ModbusRegisterMap } from '@/types/modbus';
import { supabase } from '@/integrations/supabase/client';

export const createModbusDevice = async (device: Partial<ModbusDevice>) => {
  try {
    const { data, error } = await supabase
      .from('modbus_devices')
      .insert([device])
      .select()
      .single();
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating modbus device:', error);
    throw error;
  }
};

export const getModbusDevices = async () => {
  try {
    const { data, error } = await supabase
      .from('modbus_devices')
      .select('*');
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error getting modbus devices:', error);
    throw error;
  }
};

export const getAllModbusDevices = async () => {
  return getModbusDevices();
};

export const getDeviceById = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('modbus_devices')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error getting modbus device:', error);
    throw error;
  }
};

export const updateModbusDevice = async (id: string, device: Partial<ModbusDevice>) => {
  try {
    const { data, error } = await supabase
      .from('modbus_devices')
      .update(device)
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating modbus device:', error);
    throw error;
  }
};

export const deleteModbusDevice = async (id: string) => {
  try {
    const { error } = await supabase
      .from('modbus_devices')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting modbus device:', error);
    throw error;
  }
};

export const getRegisterMap = async () => {
  try {
    const { data, error } = await supabase
      .from('modbus_register_maps')
      .select('*');
      
    if (error) throw error;
    return data as ModbusRegisterMap[];
  } catch (error) {
    console.error('Error getting register map:', error);
    throw error;
  }
};

export const writeRegister = async (deviceId: string, address: number, value: number) => {
  try {
    // In a real system, this would communicate with the device directly
    // For now, we'll just log it and simulate success
    console.log(`Writing value ${value} to register ${address} on device ${deviceId}`);
    
    // Simulate an API call or modbus communication
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Update the reading in the database if needed
    const { data, error } = await supabase
      .from('modbus_readings')
      .update({ value })
      .eq('device_id', deviceId)
      .eq('register_address', address)
      .select();
      
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error writing to modbus register:', error);
    throw error;
  }
};
