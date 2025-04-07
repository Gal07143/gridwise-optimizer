
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ModbusRegisterDefinition, ModbusRegisterMap } from '@/types/modbus';

/**
 * Get all register maps for a modbus device
 */
export const getModbusRegisterMaps = async (deviceId: string): Promise<ModbusRegisterMap[]> => {
  try {
    const { data, error } = await supabase
      .from('modbus_register_maps')
      .select('*')
      .eq('device_id', deviceId);
      
    if (error) throw error;
    
    return data || [];
  } catch (err) {
    console.error('Error fetching register maps:', err);
    toast.error('Failed to fetch register maps');
    return [];
  }
};

/**
 * Get a specific register map for a device
 */
export const getModbusRegisterMap = async (mapId: string): Promise<ModbusRegisterMap | null> => {
  try {
    const { data, error } = await supabase
      .from('modbus_register_maps')
      .select('*')
      .eq('id', mapId)
      .single();
      
    if (error) throw error;
    
    return data;
  } catch (err) {
    console.error('Error fetching register map:', err);
    toast.error('Failed to fetch register map');
    return null;
  }
};

/**
 * Convert raw register data from DB to ModbusRegisterDefinition
 */
export const processRawRegisterData = (rawData: any[]): ModbusRegisterDefinition[] => {
  return rawData.map(reg => ({
    name: reg.name,
    address: reg.address,
    registerType: reg.type || 'holding',
    dataType: reg.dataType || 'int16',
    access: reg.access || 'read',
    length: reg.length,
    scale: reg.scale,
    unit: reg.unit,
    description: reg.description
  }));
};

/**
 * Create a new register map for a device
 */
export const createModbusRegisterMap = async (
  deviceId: string,
  registers: ModbusRegisterDefinition[]
): Promise<ModbusRegisterMap | null> => {
  try {
    const { data, error } = await supabase
      .from('modbus_register_maps')
      .insert({
        name: `Map for device ${deviceId}`, // Adding a default name
        device_id: deviceId,
        registers: registers
      })
      .select()
      .single();
      
    if (error) throw error;
    
    toast.success('Register map created successfully');
    return data;
  } catch (err) {
    console.error('Error creating register map:', err);
    toast.error('Failed to create register map');
    return null;
  }
};

/**
 * Delete a register map
 */
export const deleteModbusRegisterMap = async (mapId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('modbus_register_maps')
      .delete()
      .eq('id', mapId);
      
    if (error) throw error;
    
    toast.success('Register map deleted successfully');
    return true;
  } catch (err) {
    console.error('Error deleting register map:', err);
    toast.error('Failed to delete register map');
    return false;
  }
};

/**
 * Get default register map for a device if none exists
 */
export const getDefaultRegisterMap = (deviceId: string): ModbusRegisterMap => {
  return {
    name: `Default Map for ${deviceId}`,
    device_id: deviceId,
    registers: []
  };
};
