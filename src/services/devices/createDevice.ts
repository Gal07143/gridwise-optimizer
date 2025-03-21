
import { supabase } from '@/integrations/supabase/client';
import { EnergyDevice, DeviceType, DeviceStatus } from '@/types/energy';
import { toast } from 'sonner';
import { toDbDeviceType, toDbDeviceStatus } from './deviceCompatibility';
import { executeSql } from '../sqlExecutor';

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
    
    // Convert frontend types to database-compatible types
    const dbDeviceType = toDbDeviceType(deviceData.type);
    const dbDeviceStatus = toDbDeviceStatus(deviceData.status || 'offline');
    
    const insertData = {
      name: deviceData.name,
      type: dbDeviceType,
      status: dbDeviceStatus,
      location: deviceData.location || null,
      capacity: deviceData.capacity,
      firmware: deviceData.firmware || null,
      description: deviceData.description || null,
      installation_date: deviceData.installation_date || null,
      site_id: deviceData.site_id || null,
      metrics: deviceData.metrics || null,
      created_by: deviceData.created_by || null,
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
    
    // Convert to our application's device type
    const device: EnergyDevice = {
      ...data,
      type: deviceData.type, // Use original type from frontend
      status: deviceData.status || 'offline', // Use original status from frontend
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
