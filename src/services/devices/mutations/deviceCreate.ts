
import { supabase } from '@/integrations/supabase/client';
import { EnergyDevice, DeviceType, DeviceStatus } from '@/types/energy';
import { toast } from 'sonner';
import { convertDeviceTypeForDb, convertDeviceStatusForDb } from '@/utils/deviceTypeUtils';

/**
 * Create a new device in the database
 */
export const createDevice = async (
  device: Omit<EnergyDevice, 'id' | 'created_at' | 'last_updated'>
): Promise<EnergyDevice | null> => {
  try {
    // Prepare the device data with proper type conversions for database compatibility
    const deviceData = {
      name: device.name,
      type: convertDeviceTypeForDb(device.type),
      status: convertDeviceStatusForDb(device.status),
      location: device.location,
      capacity: device.capacity,
      site_id: device.site_id,
      created_by: device.created_by,
      firmware: device.firmware,
      lat: device.lat,
      lng: device.lng,
      metrics: device.metrics,
      installation_date: device.installation_date,
      last_updated: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('devices')
      .insert(deviceData)
      .select()
      .single();

    if (error) throw error;
    
    toast.success(`Device ${device.name} created successfully`);
    return data;
  } catch (error) {
    console.error('Error creating device:', error);
    toast.error(`Failed to create device: ${error.message}`);
    return null;
  }
};

/**
 * Create multiple devices in a batch
 */
export const createDeviceBatch = async (
  devices: Omit<EnergyDevice, 'id' | 'created_at' | 'last_updated'>[]
): Promise<EnergyDevice[]> => {
  try {
    // Convert array of devices to database-compatible format
    const deviceData = devices.map(device => ({
      name: device.name,
      type: convertDeviceTypeForDb(device.type),
      status: convertDeviceStatusForDb(device.status),
      location: device.location,
      capacity: device.capacity,
      site_id: device.site_id,
      created_by: device.created_by,
      firmware: device.firmware,
      lat: device.lat,
      lng: device.lng,
      metrics: device.metrics,
      installation_date: device.installation_date,
      last_updated: new Date().toISOString()
    }));

    const { data, error } = await supabase
      .from('devices')
      .insert(deviceData)
      .select();

    if (error) throw error;
    
    toast.success(`${devices.length} devices created successfully`);
    return data;
  } catch (error) {
    console.error('Error creating devices batch:', error);
    toast.error(`Failed to create devices: ${error.message}`);
    return [];
  }
};
