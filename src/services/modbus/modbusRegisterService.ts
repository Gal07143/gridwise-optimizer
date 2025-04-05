
import { supabase } from '@/integrations/supabase/client';
import { ModbusRegisterMap } from '@/types/modbus';
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

export const getModbusRegistersByDeviceId = async (deviceId: string): Promise<ModbusRegisterData[]> => {
  try {
    const { data, error } = await supabase
      .from('modbus_registers')
      .select('*')
      .eq('device_id', deviceId);

    if (error) {
      throw error;
    }

    return data as ModbusRegisterData[] || [];
  } catch (error) {
    console.error("Error fetching Modbus registers:", error);
    toast.error("Failed to fetch registers");
    return [];
  }
};

export const getModbusRegisterMap = async (deviceId: string): Promise<ModbusRegisterMap> => {
  try {
    const registers = await getModbusRegistersByDeviceId(deviceId);
    
    // Convert to register map format
    const registerMap: ModbusRegisterMap = {};
    
    registers.forEach(register => {
      registerMap[register.register_address.toString()] = {
        name: register.register_name,
        length: register.register_length,
        scale: register.scaling_factor,
        type: 'holding_register' // Default to holding register
      };
    });
    
    return registerMap;
  } catch (error) {
    console.error("Error creating register map:", error);
    toast.error("Failed to create register map");
    return {};
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
