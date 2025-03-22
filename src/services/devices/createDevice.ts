
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
    
    // Prepare insert data
    const insertData = {
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
      // Get current user's ID for created_by if available
      created_by: (await supabase.auth.getUser()).data?.user?.id || null
    };
    
    const { data, error } = await supabase
      .from('devices')
      .insert(insertData)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    if (!data) {
      throw new Error('No data returned from insert operation');
    }
    
    console.log('Device created successfully:', data);
    
    // Return the created device
    return data as EnergyDevice;
    
  } catch (error: any) {
    console.error('Error creating device:', error);
    toast.error(`Failed to create device: ${error.message || 'Unknown error'}`);
    return null;
  }
};
