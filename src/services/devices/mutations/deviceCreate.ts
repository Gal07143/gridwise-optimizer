
import { supabase } from '@/integrations/supabase/client';
import { EnergyDevice } from '@/types/energy';
import { toast } from 'sonner';

export type CreateDeviceInput = Omit<EnergyDevice, 'id'>;

/**
 * Creates a new device in the database
 */
export const createDevice = async (deviceData: Omit<EnergyDevice, 'id'>): Promise<EnergyDevice> => {
  try {
    // Create device in devices table
    const { data, error } = await supabase
      .from('devices')
      .insert([
        {
          name: deviceData.name,
          type: deviceData.type,
          status: deviceData.status,
          location: deviceData.location,
          capacity: deviceData.capacity,
          firmware: deviceData.firmware,
          site_id: deviceData.site_id,
          description: deviceData.description,
          last_updated: deviceData.last_updated || new Date().toISOString(),
        }
      ])
      .select()
      .single();

    if (error) {
      throw new Error(`Error creating device: ${error.message}`);
    }

    if (!data) {
      throw new Error('No data returned from device creation');
    }

    // Return the created device
    return data as EnergyDevice;
  } catch (error) {
    console.error('Error in createDevice:', error);
    toast.error('Failed to create device');
    throw error;
  }
};

export default createDevice;
