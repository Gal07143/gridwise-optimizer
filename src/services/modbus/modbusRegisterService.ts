
import { supabase } from '@/integrations/supabase/client';
import { ModbusRegisterDefinition, ModbusRegisterMap } from '@/types/modbus';
import { toast } from 'sonner';

export const getModbusRegisterMap = async (deviceId: string): Promise<ModbusRegisterMap | null> => {
  try {
    // Query for the device's register map
    const { data, error } = await supabase
      .from('modbus_register_maps')
      .select('*')
      .eq('device_id', deviceId)
      .maybeSingle();

    if (error) throw error;
    
    if (!data) {
      return {
        registers: [],
        device_id: deviceId
      };
    }
    
    // Parse register map JSON
    const registerMap = data.register_map || {};
    const registers: ModbusRegisterDefinition[] = [];
    
    // Convert register map object to array
    for (const key in registerMap) {
      const register = registerMap[key];
      registers.push({
        id: key,
        device_id: deviceId,
        name: register.name || key,
        address: register.address || parseInt(key),
        registerType: register.registerType || 'holding',
        dataType: register.dataType || 'uint16',
        access: register.access || 'read',
        scaleFactor: register.scaleFactor || 1,
        unit: register.unit || '',
        description: register.description || '',
      });
    }
    
    return {
      id: data.id,
      name: data.name,
      device_id: deviceId,
      registers
    };
    
  } catch (error) {
    console.error(`Error fetching register map for device ${deviceId}:`, error);
    toast.error('Failed to fetch register map');
    return null;
  }
};

export const createRegisterDefinition = async (deviceId: string, registerDef: ModbusRegisterDefinition): Promise<ModbusRegisterDefinition | null> => {
  try {
    // Get existing register map
    const existingMap = await getModbusRegisterMap(deviceId);
    
    // Create a new register definition
    const newRegister: ModbusRegisterDefinition = {
      ...registerDef,
      id: `reg_${Date.now().toString(36)}`
    };
    
    // Add to existing registers or create new array
    const updatedRegisters = existingMap?.registers 
      ? [...existingMap.registers, newRegister] 
      : [newRegister];
    
    // Convert registers array to object for storage
    const registerMapObject: Record<string, any> = {};
    updatedRegisters.forEach(reg => {
      registerMapObject[reg.id] = {
        name: reg.name,
        address: reg.address,
        registerType: reg.registerType,
        dataType: reg.dataType,
        access: reg.access,
        scaleFactor: reg.scaleFactor,
        unit: reg.unit,
        description: reg.description
      };
    });
    
    // Update or insert register map
    let result;
    if (existingMap?.id) {
      const { data, error } = await supabase
        .from('modbus_register_maps')
        .update({ 
          register_map: registerMapObject,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingMap.id)
        .select()
        .single();
        
      if (error) throw error;
      result = data;
    } else {
      const { data, error } = await supabase
        .from('modbus_register_maps')
        .insert({
          device_id: deviceId,
          register_map: registerMapObject,
          name: 'Default Register Map',
        })
        .select()
        .single();
        
      if (error) throw error;
      result = data;
    }
    
    toast.success('Register definition added successfully');
    return newRegister;
    
  } catch (error) {
    console.error('Error creating register definition:', error);
    toast.error('Failed to create register definition');
    return null;
  }
};

export const updateRegisterDefinition = async (deviceId: string, registerId: string, registerDef: Partial<ModbusRegisterDefinition>): Promise<ModbusRegisterDefinition | null> => {
  try {
    // Get existing register map
    const existingMap = await getModbusRegisterMap(deviceId);
    
    if (!existingMap || !existingMap.registers) {
      throw new Error('Register map not found');
    }
    
    // Find register to update
    const registerIndex = existingMap.registers.findIndex(reg => reg.id === registerId);
    
    if (registerIndex === -1) {
      throw new Error('Register not found');
    }
    
    // Update register
    const updatedRegister = {
      ...existingMap.registers[registerIndex],
      ...registerDef
    };
    
    // Replace in array
    const updatedRegisters = [...existingMap.registers];
    updatedRegisters[registerIndex] = updatedRegister;
    
    // Convert registers array to object for storage
    const registerMapObject: Record<string, any> = {};
    updatedRegisters.forEach(reg => {
      registerMapObject[reg.id] = {
        name: reg.name,
        address: reg.address,
        registerType: reg.registerType,
        dataType: reg.dataType,
        access: reg.access,
        scaleFactor: reg.scaleFactor,
        unit: reg.unit,
        description: reg.description
      };
    });
    
    // Update register map
    const { error } = await supabase
      .from('modbus_register_maps')
      .update({ 
        register_map: registerMapObject,
        updated_at: new Date().toISOString()
      })
      .eq('id', existingMap.id);
      
    if (error) throw error;
    
    toast.success('Register definition updated successfully');
    return updatedRegister;
    
  } catch (error) {
    console.error('Error updating register definition:', error);
    toast.error('Failed to update register definition');
    return null;
  }
};

export const deleteRegisterDefinition = async (deviceId: string, registerId: string): Promise<boolean> => {
  try {
    // Get existing register map
    const existingMap = await getModbusRegisterMap(deviceId);
    
    if (!existingMap || !existingMap.registers) {
      throw new Error('Register map not found');
    }
    
    // Filter out register to delete
    const updatedRegisters = existingMap.registers.filter(reg => reg.id !== registerId);
    
    // Convert registers array to object for storage
    const registerMapObject: Record<string, any> = {};
    updatedRegisters.forEach(reg => {
      registerMapObject[reg.id] = {
        name: reg.name,
        address: reg.address,
        registerType: reg.registerType,
        dataType: reg.dataType,
        access: reg.access,
        scaleFactor: reg.scaleFactor,
        unit: reg.unit,
        description: reg.description
      };
    });
    
    // Update register map
    const { error } = await supabase
      .from('modbus_register_maps')
      .update({ 
        register_map: registerMapObject,
        updated_at: new Date().toISOString()
      })
      .eq('id', existingMap.id);
      
    if (error) throw error;
    
    toast.success('Register definition deleted successfully');
    return true;
    
  } catch (error) {
    console.error('Error deleting register definition:', error);
    toast.error('Failed to delete register definition');
    return false;
  }
};
