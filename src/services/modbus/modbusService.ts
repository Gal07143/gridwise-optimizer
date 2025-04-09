
import { supabase } from '@/integrations/supabase/client';
import { ModbusDeviceConfig, ModbusRegisterDefinition, ModbusReadingResult } from '@/types/modbus';

export const createModbusDevice = async (deviceData: Partial<ModbusDeviceConfig>): Promise<ModbusDeviceConfig | null> => {
  try {
    const device = {
      name: deviceData.name || 'Unnamed Device',
      ip: deviceData.ip || '127.0.0.1',
      ip_address: deviceData.ip || deviceData.ip_address || '127.0.0.1',
      port: deviceData.port || 502,
      unit_id: deviceData.unit_id || 1,
      protocol: deviceData.protocol || 'tcp',
      is_active: deviceData.is_active !== undefined ? deviceData.is_active : true,
      description: deviceData.description || '',
      site_id: deviceData.site_id || null
    };

    const { data, error } = await supabase
      .from('modbus_devices')
      .insert(device)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data as ModbusDeviceConfig;
  } catch (error) {
    console.error('Error creating Modbus device:', error);
    return null;
  }
};

export const updateModbusDevice = async (id: string, deviceData: Partial<ModbusDeviceConfig>): Promise<ModbusDeviceConfig | null> => {
  try {
    // Create a copy of deviceData to modify
    const updatedData = { ...deviceData };

    // Ensure ip_address and ip are in sync
    if (deviceData.ip) {
      updatedData.ip_address = deviceData.ip;
    } else if (deviceData.ip_address) {
      updatedData.ip = deviceData.ip_address;
    }

    const { data, error } = await supabase
      .from('modbus_devices')
      .update(updatedData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data as ModbusDeviceConfig;
  } catch (error) {
    console.error('Error updating Modbus device:', error);
    return null;
  }
};

export const readRegister = async (
  device: ModbusDeviceConfig,
  register: ModbusRegisterDefinition
): Promise<ModbusReadingResult> => {
  try {
    // This would normally connect to a real Modbus device
    // For demo purposes, we'll simulate a reading
    const value = Math.random() * 100; // Mock value
    
    // Create the result
    const result: ModbusReadingResult = {
      address: register.address,
      value: value,
      formattedValue: `${(value * (register.scaleFactor || 1)).toFixed(2)} ${register.unit || ''}`,
      timestamp: new Date().toISOString(),
      success: true
    };

    return result;
  } catch (error) {
    console.error(`Error reading register ${register.address} from ${device.ip}:${device.port}`, error);
    return {
      address: register.address,
      value: 0,
      formattedValue: 'Error',
      timestamp: new Date().toISOString(),
      success: false,
      error: error instanceof Error ? error : new Error('Unknown error')
    };
  }
};

export const writeRegister = async (
  device: ModbusDeviceConfig,
  register: ModbusRegisterDefinition,
  value: number
): Promise<boolean> => {
  try {
    // This would normally connect to a real Modbus device
    // For demo purposes, we'll just simulate a successful write
    console.log(`Writing value ${value} to register ${register.address} on device ${device.name} at ${device.ip}:${device.port}`);
    
    // Log to Supabase (optional)
    await supabase.from('modbus_write_logs').insert({
      device_id: device.id,
      register_address: register.address,
      register_name: register.name,
      value: value,
      timestamp: new Date().toISOString()
    });
    
    return true;
  } catch (error) {
    console.error(`Error writing to register ${register.address}`, error);
    return false;
  }
};
