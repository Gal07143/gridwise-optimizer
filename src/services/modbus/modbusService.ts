
import { supabase } from '@/integrations/supabase/client';
import { ModbusDevice, ModbusReadingResult } from '@/types/modbus';
import { toast } from 'sonner';

// Get a Modbus device by ID
export const getModbusDeviceById = async (id: string): Promise<ModbusDevice | null> => {
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
    throw error;
  }
};

// Update a Modbus device
export const updateModbusDevice = async (
  id: string,
  deviceData: Partial<ModbusDevice>
): Promise<ModbusDevice> => {
  try {
    const { data, error } = await supabase
      .from('modbus_devices')
      .update(deviceData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as ModbusDevice;
  } catch (error) {
    console.error('Error updating Modbus device:', error);
    throw error;
  }
};

// Delete a Modbus device
export const deleteModbusDevice = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('modbus_devices')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting Modbus device:', error);
    throw error;
  }
};

// Mock function for reading a Modbus register (in a real app, this would communicate with a backend API)
export const readRegister = async (
  deviceId: string,
  address: number,
  length: number
): Promise<ModbusReadingResult> => {
  try {
    // In a real app, this would make an API call to read from the device
    // For demo purposes, simulate a successful read with a random value
    await new Promise(resolve => setTimeout(resolve, 500)); // Add a small delay
    
    return {
      success: true,
      value: Math.floor(Math.random() * 1000),
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to read register',
      timestamp: new Date().toISOString()
    };
  }
};

// Mock function for writing to a Modbus register
export const writeRegister = async (
  deviceId: string,
  address: number,
  value: number,
  dataType: string
): Promise<boolean> => {
  try {
    // In a real app, this would make an API call to write to the device
    // For demo purposes, simulate a successful write
    await new Promise(resolve => setTimeout(resolve, 700)); // Add a small delay
    
    // Randomly fail some requests for demonstration
    if (Math.random() > 0.9) {
      throw new Error('Simulated write failure');
    }
    
    return true;
  } catch (error) {
    throw error;
  }
};

// Check if a device is online
export const checkDeviceConnection = async (deviceId: string): Promise<boolean> => {
  try {
    // In a real app, this would ping the device or check its status
    // For demo purposes, return true most of the time
    return Math.random() > 0.2;
  } catch {
    return false;
  }
};
