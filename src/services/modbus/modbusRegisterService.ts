
import { supabase } from '@/integrations/supabase/client';
import { ModbusRegisterMap, ModbusRegisterDefinition } from '@/types/modbus';

// Get modbus registers by device ID
export const getModbusRegistersByDeviceId = async (deviceId: string): Promise<ModbusRegisterDefinition[]> => {
  try {
    const { data, error } = await supabase
      .from('modbus_register_maps')
      .select('*')
      .eq('device_id', deviceId)
      .single();

    if (error) {
      console.error('Error fetching modbus registers:', error);
      return [];
    }
    
    const registerMap = data?.register_map as { registers: ModbusRegisterDefinition[] };
    return registerMap?.registers || [];
  } catch (error) {
    console.error('Error in getModbusRegistersByDeviceId:', error);
    return [];
  }
};

// Get default register map
export const getDefaultRegisterMap = (): ModbusRegisterMap => {
  return {
    registers: [
      {
        id: crypto.randomUUID(),
        name: 'Voltage',
        address: 100,
        registerType: 'holding',
        dataType: 'float32',
        access: 'read',
        scaleFactor: 1,
        unit: 'V',
        description: 'Output voltage'
      },
      {
        id: crypto.randomUUID(),
        name: 'Current',
        address: 102,
        registerType: 'holding',
        dataType: 'float32',
        access: 'read',
        scaleFactor: 1,
        unit: 'A',
        description: 'Output current'
      },
      {
        id: crypto.randomUUID(),
        name: 'Power',
        address: 104,
        registerType: 'holding',
        dataType: 'float32',
        access: 'read',
        scaleFactor: 1,
        unit: 'W',
        description: 'Active power'
      },
      {
        id: crypto.randomUUID(),
        name: 'Energy',
        address: 106,
        registerType: 'holding',
        dataType: 'float32',
        access: 'read',
        scaleFactor: 1,
        unit: 'kWh',
        description: 'Energy counter'
      },
      {
        id: crypto.randomUUID(),
        name: 'Status',
        address: 108,
        registerType: 'holding',
        dataType: 'uint16',
        access: 'read',
        scaleFactor: 1,
        description: 'Device status'
      }
    ],
    name: 'Default Register Map'
  };
};

// Save register map
export const saveRegisterMap = async (deviceId: string, registerMap: ModbusRegisterMap): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('modbus_register_maps')
      .upsert({
        device_id: deviceId,
        register_map: registerMap,
        name: registerMap.name || 'Custom Register Map'
      });

    if (error) {
      console.error('Error saving register map:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in saveRegisterMap:', error);
    return false;
  }
};

// Delete register map
export const deleteRegisterMap = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('modbus_register_maps')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting register map:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in deleteRegisterMap:', error);
    return false;
  }
};
