
import { supabase } from '@/integrations/supabase/client';
import { EnergyDevice, DeviceType, DeviceStatus } from '@/types/energy';
import { toast } from 'sonner';

// Function to update a device
export const updateDevice = async (
  deviceId: string, 
  deviceData: Partial<EnergyDevice>
): Promise<EnergyDevice | null> => {
  try {
    console.log('Updating device with ID:', deviceId, 'Data:', deviceData);
    
    // Convert DeviceType to string for Supabase
    let typeStr = undefined;
    if (deviceData.type) {
      if (!isValidDeviceTypeForDB(deviceData.type)) {
        console.warn(`Converting device type ${deviceData.type} to compatible type`);
        typeStr = convertToValidDeviceType(deviceData.type);
      } else {
        typeStr = deviceData.type;
      }
    }
    
    // Convert DeviceStatus to string for Supabase
    let statusStr = undefined;
    if (deviceData.status) {
      if (!isValidDeviceStatusForDB(deviceData.status)) {
        console.warn(`Converting device status ${deviceData.status} to compatible status`);
        statusStr = convertToValidDeviceStatus(deviceData.status);
      } else {
        statusStr = deviceData.status;
      }
    }
    
    const { data, error } = await supabase
      .from('devices')
      .update({
        name: deviceData.name,
        type: typeStr,
        status: statusStr,
        location: deviceData.location,
        capacity: deviceData.capacity,
        firmware: deviceData.firmware,
        description: deviceData.description,
        installation_date: deviceData.installation_date,
        site_id: deviceData.site_id,
        metrics: deviceData.metrics,
      })
      .eq('id', deviceId)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    if (!data) {
      throw new Error('No data returned from update operation');
    }
    
    console.log('Device updated successfully:', data);
    
    // Convert to our application's device type
    const device: EnergyDevice = {
      ...data,
      type: data.type as DeviceType,
      status: data.status as DeviceStatus,
      metrics: data.metrics as Record<string, number> | null
    };
    
    toast.success('Device updated successfully');
    return device;
    
  } catch (error: any) {
    console.error('Error updating device:', error);
    toast.error(`Failed to update device: ${error.message || 'Unknown error'}`);
    return null;
  }
};

// Function to create a device - reexported from createDevice.ts
export { createDevice } from './createDevice';

// Function to delete a device
export const deleteDevice = async (deviceId: string): Promise<boolean> => {
  try {
    console.log('Deleting device with ID:', deviceId);
    
    const { error } = await supabase
      .from('devices')
      .delete()
      .eq('id', deviceId);
    
    if (error) {
      throw error;
    }
    
    console.log('Device deleted successfully');
    toast.success('Device deleted successfully');
    return true;
    
  } catch (error: any) {
    console.error('Error deleting device:', error);
    toast.error(`Failed to delete device: ${error.message || 'Unknown error'}`);
    return false;
  }
};

// Function to batch update multiple devices
export const batchUpdateDevices = async (
  devices: { id: string; updates: Partial<EnergyDevice> }[]
): Promise<boolean> => {
  try {
    console.log('Batch updating devices:', devices);
    
    // We need to perform updates one by one because Supabase doesn't support batch updates
    for (const device of devices) {
      // Convert types for DB compatibility
      const updates = { ...device.updates };
      
      if (updates.type && !isValidDeviceTypeForDB(updates.type)) {
        updates.type = convertToValidDeviceType(updates.type);
      }
      
      if (updates.status && !isValidDeviceStatusForDB(updates.status)) {
        updates.status = convertToValidDeviceStatus(updates.status);
      }
      
      const { error } = await supabase
        .from('devices')
        .update(updates)
        .eq('id', device.id);
      
      if (error) {
        throw error;
      }
    }
    
    console.log('Batch update completed successfully');
    toast.success('Devices updated successfully');
    return true;
    
  } catch (error: any) {
    console.error('Error batch updating devices:', error);
    toast.error(`Failed to update devices: ${error.message || 'Unknown error'}`);
    return false;
  }
};

// Helper functions
export function isValidDeviceTypeForDB(type: string): boolean {
  return ['solar', 'wind', 'battery', 'grid', 'load', 'ev_charger'].includes(type);
}

export function isValidDeviceStatusForDB(status: string): boolean {
  return ['online', 'offline', 'maintenance', 'error'].includes(status);
}

export function convertToValidDeviceType(type: DeviceType): string {
  // Map non-supported types to supported ones
  switch (type) {
    case 'inverter':
    case 'meter':
      return 'grid'; // Map to closest equivalent
    default:
      return type; 
  }
}

export function convertToValidDeviceStatus(status: DeviceStatus): string {
  // Map non-supported statuses to supported ones
  switch (status) {
    case 'warning':
      return 'maintenance'; // Map to closest equivalent
    default:
      return status;
  }
}
