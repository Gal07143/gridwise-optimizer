
import { supabase } from '@/integrations/supabase/client';
import { EnergyDevice, DeviceType, DeviceStatus } from '@/types/energy';
import { toast } from 'sonner';

export const createDevice = async (deviceData: Omit<EnergyDevice, 'id' | 'created_at' | 'last_updated'>): Promise<EnergyDevice | null> => {
  try {
    console.log('Creating device with data:', deviceData);
    
    // Validate required fields
    if (!deviceData.name) {
      throw new Error('Device name is required');
    }
    
    if (!deviceData.type) {
      throw new Error('Device type is required');
    }
    
    if (!deviceData.capacity || deviceData.capacity <= 0) {
      throw new Error('Capacity must be greater than 0');
    }
    
    const { data, error } = await supabase
      .from('devices')
      .insert([{
        name: deviceData.name,
        type: deviceData.type,
        status: deviceData.status || 'offline',
        location: deviceData.location || null,
        capacity: deviceData.capacity,
        firmware: deviceData.firmware || null,
        description: deviceData.description || null,
        installation_date: deviceData.installation_date || null,
        site_id: deviceData.site_id || null,
        metrics: deviceData.metrics || null,
        created_by: deviceData.created_by || null,
      }])
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    if (!data) {
      throw new Error('No data returned from insert operation');
    }
    
    console.log('Device created successfully:', data);
    
    // Convert to our application's device type
    const device: EnergyDevice = {
      ...data,
      type: data.type as DeviceType,
      status: data.status as DeviceStatus,
      metrics: data.metrics as Record<string, number> | null
    };
    
    toast.success('Device created successfully');
    return device;
    
  } catch (error: any) {
    console.error('Error creating device:', error);
    toast.error(`Failed to create device: ${error.message || 'Unknown error'}`);
    return null;
  }
};
