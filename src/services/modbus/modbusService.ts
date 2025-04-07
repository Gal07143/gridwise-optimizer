
import { supabase } from '@/integrations/supabase/client';
import { ModbusDevice, ModbusReadingResult, ModbusRegisterDefinition } from '@/types/modbus';
import { toast } from 'sonner';

/**
 * Read a Modbus register from a device
 */
export const readModbusRegister = async (
  deviceId: string,
  register: ModbusRegisterDefinition
): Promise<ModbusReadingResult> => {
  try {
    console.log(`Reading register ${register.name} from device ${deviceId}`);
    
    // First, get the device details to ensure it exists
    const { data: device, error: deviceError } = await supabase
      .from('modbus_devices')
      .select('*')
      .eq('id', deviceId)
      .single();
      
    if (deviceError) {
      console.error('Error fetching device:', deviceError);
      throw new Error(`Device not found: ${deviceError.message}`);
    }
    
    if (!device) {
      throw new Error(`Device with ID ${deviceId} not found`);
    }
    
    // Prepare the request to the Edge Function
    const payload = {
      deviceId,
      ip: device.ip,
      port: device.port,
      unitId: device.unit_id,
      register: {
        address: register.address,
        quantity: register.length || 1,
        type: register.registerType || 'holding',
        dataType: register.dataType || 'int16'
      }
    };
    
    // Call the Supabase Edge Function for Modbus communication
    const { data, error } = await supabase.functions.invoke('modbus-read', {
      body: JSON.stringify(payload)
    });
    
    if (error) {
      console.error('Error calling Modbus function:', error);
      throw new Error(`Modbus read error: ${error.message}`);
    }
    
    // Apply scaling if needed
    let scaledValue = data.value;
    if (register.scaleFactor !== undefined) {
      scaledValue = data.value * register.scaleFactor;
    } else if (register.scale !== undefined) {
      scaledValue = data.value * register.scale;
    }
    
    const result: ModbusReadingResult = {
      value: scaledValue,
      address: register.address,
      buffer: data.buffer,
      raw: data.raw,
      success: true, // Adding for backward compatibility
      timestamp: new Date().toISOString(), // Adding for backward compatibility
    };
    
    return result;
    
  } catch (err) {
    console.error('Error reading Modbus register:', err);
    const errorMessage = err instanceof Error ? err.message : 'Unknown error reading Modbus register';
    const errorObj = err instanceof Error ? err : new Error(errorMessage);
    
    return {
      value: 0,
      address: register.address,
      error: errorObj,
      success: false, // Adding for backward compatibility
    };
  }
};

// More functions will be added here as needed
