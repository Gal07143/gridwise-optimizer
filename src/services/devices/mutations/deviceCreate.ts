
import { supabase } from '@/integrations/supabase/client';
import { EnergyDevice } from '@/types/energy';
import { toast } from 'sonner';
import { toDbDeviceType, toDbDeviceStatus } from '../deviceCompatibility';

export type CreateDeviceInput = Omit<EnergyDevice, 'id'>;

/**
 * Creates a new device in the database
 */
export const createDevice = async (deviceData: Omit<EnergyDevice, 'id'>): Promise<EnergyDevice> => {
  try {
    // Convert frontend types to database types
    const dbDeviceType = toDbDeviceType(deviceData.type);
    const dbDeviceStatus = toDbDeviceStatus(deviceData.status);
    
    // Create device in devices table
    const { data, error } = await supabase
      .from('devices')
      .insert({
        name: deviceData.name,
        type: dbDeviceType,
        status: dbDeviceStatus,
        location: deviceData.location,
        capacity: deviceData.capacity,
        firmware: deviceData.firmware,
        site_id: deviceData.site_id,
        description: deviceData.description,
        last_updated: deviceData.last_updated || new Date().toISOString(),
        metrics: deviceData.metrics
      })
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
