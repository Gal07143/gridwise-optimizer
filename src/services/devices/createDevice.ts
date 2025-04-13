
import { supabase } from '@/integrations/supabase/client';
import { EnergyDevice } from '@/types/energy';
import { handleError } from '@/utils/handleError';
import { v4 as uuidv4 } from 'uuid';

/**
 * Creates a new device in the database
 * @param deviceData Device data to create
 * @returns The created device with its ID
 */
export const createDevice = async (deviceData: Omit<EnergyDevice, 'id'>): Promise<EnergyDevice> => {
  try {
    const device = {
      id: uuidv4(),
      ...deviceData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('devices')
      .insert(device)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create device: ${error.message}`);
    }

    console.log('Device created successfully:', data);
    return data as EnergyDevice;
  } catch (error) {
    return handleError(error, 'createDevice', false);
  }
};
