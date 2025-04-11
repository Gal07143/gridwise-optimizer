
import { supabase } from '@/integrations/supabase/client';
import { ModbusRegister, ModbusRegisterMap } from '@/types/modbus';

/**
 * Get default register map for a device
 */
export const getDefaultRegisterMap = (deviceId: string): ModbusRegisterMap => {
  return {
    device_id: deviceId,
    name: 'Default Map',
    registers: []
  };
};

/**
 * Fetch modbus registers by device ID
 */
export const getModbusRegistersByDeviceId = async (deviceId: string): Promise<ModbusRegister[]> => {
  try {
    const { data, error } = await supabase
      .from('modbus_registers')
      .select('*')
      .eq('device_id', deviceId);
      
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Error fetching modbus registers:', error);
    return [];
  }
};

/**
 * Create a modbus register
 */
export const createModbusRegister = async (register: Omit<ModbusRegister, 'id'>): Promise<ModbusRegister | null> => {
  try {
    const { data, error } = await supabase
      .from('modbus_registers')
      .insert(register)
      .select()
      .single();
      
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error creating modbus register:', error);
    return null;
  }
};

/**
 * Update a modbus register
 */
export const updateModbusRegister = async (id: string, updates: Partial<ModbusRegister>): Promise<ModbusRegister | null> => {
  try {
    const { data, error } = await supabase
      .from('modbus_registers')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error updating modbus register:', error);
    return null;
  }
};

/**
 * Delete a modbus register
 */
export const deleteModbusRegister = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('modbus_registers')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error deleting modbus register:', error);
    return false;
  }
};

/**
 * Convert ModbusRegisterDefinition to ModbusRegister
 */
export const convertRegisterDefinitionToRegister = (
  definition: ModbusRegisterDefinition, 
  deviceId: string
): Omit<ModbusRegister, 'id'> => {
  return {
    device_id: deviceId,
    register_address: definition.address,
    register_name: definition.name,
    register_type: definition.registerType,
    data_type: definition.dataType,
    register_length: definition.dataType.includes('32') ? 2 : (definition.dataType.includes('64') ? 4 : 1),
    description: definition.description,
    access: definition.access,
    scaleFactor: 1
  };
};

/**
 * Save a register map to the database
 */
export const saveRegisterMap = async (map: ModbusRegisterMap): Promise<boolean> => {
  try {
    // First delete existing registers for this device
    const { error: deleteError } = await supabase
      .from('modbus_registers')
      .delete()
      .eq('device_id', map.device_id);
      
    if (deleteError) throw deleteError;
    
    // Convert definitions to registers
    const registers = map.registers.map(def => convertRegisterDefinitionToRegister(def, map.device_id));
    
    // Insert new registers
    if (registers.length > 0) {
      const { error: insertError } = await supabase
        .from('modbus_registers')
        .insert(registers);
        
      if (insertError) throw insertError;
    }
    
    return true;
  } catch (error) {
    console.error('Error saving register map:', error);
    return false;
  }
};
