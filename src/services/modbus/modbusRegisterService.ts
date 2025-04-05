
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ModbusRegister, ModbusRegisterMap } from '@/types/modbus';

/**
 * Get registers for a specific Modbus device
 */
export const getModbusRegistersByDeviceId = async (deviceId: string): Promise<ModbusRegister[]> => {
  try {
    const { data, error } = await supabase
      .from('modbus_registers')
      .select('*')
      .eq('device_id', deviceId)
      .order('register_address');
      
    if (error) {
      throw error;
    }
    
    return data || [];
    
  } catch (error: any) {
    console.error('Error fetching modbus registers:', error);
    toast.error(`Failed to fetch modbus registers: ${error.message || 'Unknown error'}`);
    return [];
  }
};

/**
 * Create a new Modbus register
 */
export const createModbusRegister = async (registerData: Omit<ModbusRegister, 'id' | 'created_at'>): Promise<ModbusRegister | null> => {
  try {
    const { data, error } = await supabase
      .from('modbus_registers')
      .insert({
        device_id: registerData.device_id,
        register_address: registerData.register_address,
        register_name: registerData.register_name,
        register_length: registerData.register_length,
        scaling_factor: registerData.scaling_factor
      })
      .select()
      .single();
      
    if (error) {
      throw error;
    }
    
    toast.success('Modbus register created successfully');
    return data as ModbusRegister;
    
  } catch (error: any) {
    console.error('Error creating modbus register:', error);
    toast.error(`Failed to create modbus register: ${error.message || 'Unknown error'}`);
    return null;
  }
};

/**
 * Update a Modbus register
 */
export const updateModbusRegister = async (registerId: string, registerData: Partial<ModbusRegister>): Promise<ModbusRegister | null> => {
  try {
    const { data, error } = await supabase
      .from('modbus_registers')
      .update({
        register_address: registerData.register_address,
        register_name: registerData.register_name,
        register_length: registerData.register_length,
        scaling_factor: registerData.scaling_factor
      })
      .eq('id', registerId)
      .select()
      .single();
      
    if (error) {
      throw error;
    }
    
    toast.success('Modbus register updated successfully');
    return data as ModbusRegister;
    
  } catch (error: any) {
    console.error('Error updating modbus register:', error);
    toast.error(`Failed to update modbus register: ${error.message || 'Unknown error'}`);
    return null;
  }
};

/**
 * Delete a Modbus register
 */
export const deleteModbusRegister = async (registerId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('modbus_registers')
      .delete()
      .eq('id', registerId);
      
    if (error) {
      throw error;
    }
    
    toast.success('Modbus register deleted successfully');
    return true;
    
  } catch (error: any) {
    console.error('Error deleting modbus register:', error);
    toast.error(`Failed to delete modbus register: ${error.message || 'Unknown error'}`);
    return false;
  }
};

/**
 * Save a complete register map for a device
 */
export const saveModbusRegisterMap = async (deviceId: string, registers: Omit<ModbusRegister, 'id' | 'device_id' | 'created_at'>[]): Promise<boolean> => {
  try {
    // First, delete existing registers
    const { error: deleteError } = await supabase
      .from('modbus_registers')
      .delete()
      .eq('device_id', deviceId);
      
    if (deleteError) {
      throw deleteError;
    }
    
    // Now insert the new registers
    if (registers.length > 0) {
      const registersToInsert = registers.map(reg => ({
        device_id: deviceId,
        register_address: reg.register_address,
        register_name: reg.register_name,
        register_length: reg.register_length,
        scaling_factor: reg.scaling_factor
      }));
      
      const { error: insertError } = await supabase
        .from('modbus_registers')
        .insert(registersToInsert);
        
      if (insertError) {
        throw insertError;
      }
    }
    
    toast.success('Modbus register map saved successfully');
    return true;
    
  } catch (error: any) {
    console.error('Error saving modbus register map:', error);
    toast.error(`Failed to save modbus register map: ${error.message || 'Unknown error'}`);
    return false;
  }
};
