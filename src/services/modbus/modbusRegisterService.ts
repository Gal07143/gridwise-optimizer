
import { supabase } from '@/integrations/supabase/client';
import { ModbusRegisterMap, ModbusRegisterDefinition, ModbusRegister } from '@/types/modbus';
import { toast } from 'sonner';

// Renamed from ModbusRegister to ModbusRegisterData to avoid conflict
interface ModbusRegisterData {
  id: string;
  device_id: string;
  register_address: number;
  register_name: string;
  register_length: number;
  scaling_factor: number;
  created_at?: string;
}

export const getModbusRegistersByDeviceId = async (deviceId: string): Promise<ModbusRegister[]> => {
  try {
    const { data, error } = await supabase
      .from('modbus_registers')
      .select('*')
      .eq('device_id', deviceId);

    if (error) {
      throw error;
    }

    return data as ModbusRegister[] || [];
  } catch (error) {
    console.error("Error fetching Modbus registers:", error);
    toast.error("Failed to fetch registers");
    return [];
  }
};

export const getRegisterMap = async (deviceId: string): Promise<ModbusRegisterMap> => {
  try {
    const registers = await getModbusRegistersByDeviceId(deviceId);
    
    // Convert to register map format
    const registerDefinitions: ModbusRegisterDefinition[] = registers.map(register => ({
      name: register.register_name,
      address: register.register_address,
      length: register.register_length,
      scale: register.scaling_factor,
      type: 'holding_register', // Default to holding register
      dataType: 'int16' // Default to int16
    }));
    
    return {
      registers: registerDefinitions,
      device_id: deviceId
    };
  } catch (error) {
    console.error("Error creating register map:", error);
    toast.error("Failed to create register map");
    return {
      registers: [],
      device_id: deviceId
    };
  }
};

export const saveRegisterMap = async (deviceId: string, registerMap: ModbusRegisterMap): Promise<boolean> => {
  try {
    // First delete existing registers for this device
    const { error: deleteError } = await supabase
      .from('modbus_registers')
      .delete()
      .eq('device_id', deviceId);
    
    if (deleteError) throw deleteError;
    
    // Then insert new registers
    const registersToInsert = registerMap.registers.map(reg => ({
      device_id: deviceId,
      register_address: reg.address,
      register_name: reg.name,
      register_length: reg.length,
      scaling_factor: reg.scale || 1,
    }));
    
    if (registersToInsert.length === 0) {
      return true; // No registers to insert
    }
    
    const { error } = await supabase
      .from('modbus_registers')
      .insert(registersToInsert);
      
    if (error) throw error;
    
    toast.success('Register map saved successfully');
    return true;
  } catch (error) {
    console.error("Error saving register map:", error);
    toast.error("Failed to save register map");
    return false;
  }
};

export const createModbusRegister = async (registerData: Omit<ModbusRegisterData, 'id' | 'created_at'>): Promise<ModbusRegisterData | null> => {
  try {
    const { data, error } = await supabase
      .from('modbus_registers')
      .insert(registerData)
      .select();
      
    if (error) {
      throw error;
    }
    
    return data?.[0] as ModbusRegisterData || null;
  } catch (error) {
    console.error("Error creating Modbus register:", error);
    toast.error("Failed to create register");
    return null;
  }
};

export const updateModbusRegister = async (registerId: string, registerData: Partial<ModbusRegisterData>): Promise<ModbusRegisterData | null> => {
  try {
    const { data, error } = await supabase
      .from('modbus_registers')
      .update(registerData)
      .eq('id', registerId)
      .select();
      
    if (error) {
      throw error;
    }
    
    return data?.[0] as ModbusRegisterData || null;
  } catch (error) {
    console.error("Error updating Modbus register:", error);
    toast.error("Failed to update register");
    return null;
  }
};

export const deleteModbusRegister = async (registerId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('modbus_registers')
      .delete()
      .eq('id', registerId);
      
    if (error) {
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error("Error deleting Modbus register:", error);
    toast.error("Failed to delete register");
    return false;
  }
};

export const bulkCreateModbusRegisters = async (deviceId: string, registers: Array<Omit<ModbusRegisterData, 'id' | 'device_id' | 'created_at'>>): Promise<boolean> => {
  try {
    // Add device_id to each register
    const registersWithDeviceId = registers.map(register => ({
      ...register,
      device_id: deviceId
    }));
    
    const { error } = await supabase
      .from('modbus_registers')
      .insert(registersWithDeviceId);
      
    if (error) {
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error("Error creating Modbus registers in bulk:", error);
    toast.error("Failed to create registers");
    return false;
  }
};
