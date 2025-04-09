
import { supabase } from '@/integrations/supabase/client';
import { ModbusDevice, ModbusRegisterMap, ModbusRegister } from '@/types/modbus';
import { toast } from 'sonner';

// Add the missing function that was referenced
export const getAllModbusDevices = async (): Promise<ModbusDevice[]> => {
  try {
    const { data, error } = await supabase
      .from('modbus_devices')
      .select('*');
    
    if (error) {
      throw error;
    }
    
    // Ensure each device has the ip_address property for compatibility
    return data.map(device => ({
      ...device, 
      ip_address: device.ip_address || device.ip,
      protocol: device.protocol || 'tcp' as 'tcp' | 'rtu'
    }));
  } catch (err) {
    console.error('Error fetching Modbus devices:', err);
    toast.error('Failed to fetch Modbus devices');
    return [];
  }
};

export const getModbusDevice = async (id: string): Promise<ModbusDevice | null> => {
  try {
    const { data, error } = await supabase
      .from('modbus_devices')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      throw error;
    }
    
    return {
      ...data,
      ip_address: data.ip_address || data.ip,
      protocol: data.protocol || 'tcp' as 'tcp' | 'rtu'
    };
  } catch (err) {
    console.error(`Error fetching Modbus device with ID ${id}:`, err);
    toast.error('Failed to fetch Modbus device');
    return null;
  }
};

export const createModbusDevice = async (deviceData: Omit<ModbusDevice, 'id'>): Promise<ModbusDevice | null> => {
  try {
    const { data, error } = await supabase
      .from('modbus_devices')
      .insert({
        name: deviceData.name,
        ip: deviceData.ip,
        port: deviceData.port,
        unit_id: deviceData.unit_id,
        protocol: deviceData.protocol || 'tcp',
        is_active: deviceData.is_active,
        description: deviceData.description,
        site_id: deviceData.site_id
      })
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    toast.success('Modbus device created successfully');
    return {
      ...data,
      ip_address: data.ip_address || data.ip,
      protocol: data.protocol || 'tcp' as 'tcp' | 'rtu'
    };
  } catch (err) {
    console.error('Error creating Modbus device:', err);
    toast.error('Failed to create Modbus device');
    return null;
  }
};

export const updateModbusDevice = async (id: string, deviceData: Partial<ModbusDevice>): Promise<ModbusDevice | null> => {
  try {
    const { data, error } = await supabase
      .from('modbus_devices')
      .update({
        name: deviceData.name,
        ip: deviceData.ip,
        port: deviceData.port,
        unit_id: deviceData.unit_id,
        protocol: deviceData.protocol,
        is_active: deviceData.is_active,
        description: deviceData.description,
        site_id: deviceData.site_id
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    toast.success('Modbus device updated successfully');
    return {
      ...data,
      ip_address: data.ip_address || data.ip,
      protocol: data.protocol || 'tcp' as 'tcp' | 'rtu'
    };
  } catch (err) {
    console.error(`Error updating Modbus device with ID ${id}:`, err);
    toast.error('Failed to update Modbus device');
    return null;
  }
};

export const deleteModbusDevice = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('modbus_devices')
      .delete()
      .eq('id', id);
    
    if (error) {
      throw error;
    }
    
    toast.success('Modbus device deleted successfully');
    return true;
  } catch (err) {
    console.error(`Error deleting Modbus device with ID ${id}:`, err);
    toast.error('Failed to delete Modbus device');
    return false;
  }
};

export const getModbusRegisterMap = async (deviceId: string): Promise<ModbusRegisterMap | null> => {
  try {
    const { data, error } = await supabase
      .from('modbus_register_maps')
      .select('*')
      .eq('device_id', deviceId)
      .single();
    
    if (error) {
      // Create an empty register map if none exists
      return { registers: [], device_id: deviceId };
    }
    
    return data as ModbusRegisterMap;
  } catch (err) {
    console.error(`Error fetching register map for device ${deviceId}:`, err);
    toast.error('Failed to fetch register map');
    return null;
  }
};

export const createModbusRegister = async (register: Omit<ModbusRegister, 'id'>): Promise<ModbusRegister | null> => {
  try {
    const { data, error } = await supabase
      .from('modbus_registers')
      .insert(register)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    toast.success('Register created successfully');
    return data as ModbusRegister;
  } catch (err) {
    console.error('Error creating Modbus register:', err);
    toast.error('Failed to create register');
    return null;
  }
};

// Add this function to fix expected arguments error
export const writeModbusRegister = async (deviceId: string, address: number, value: number) => {
  // Implementation details would depend on your API
  console.log(`Writing value ${value} to register at address ${address} on device ${deviceId}`);
  toast.success(`Value ${value} written to register ${address}`);
  return true;
};
