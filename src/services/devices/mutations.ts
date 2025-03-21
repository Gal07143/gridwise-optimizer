
import { supabase } from '@/integrations/supabase/client';
import { EnergyDevice, DeviceType, DeviceStatus } from '@/types/energy';
import { toast } from 'sonner';
import { toDbDeviceType, toDbDeviceStatus } from './deviceCompatibility';

// Function to update a device
export const updateDevice = async (
  deviceId: string, 
  deviceData: Partial<EnergyDevice>
): Promise<EnergyDevice | null> => {
  try {
    console.log('Updating device with ID:', deviceId, 'Data:', deviceData);
    
    // Prepare update data with DB-compatible types
    const updateData: any = {};
    
    if (deviceData.name !== undefined) {
      updateData.name = deviceData.name;
    }
    
    if (deviceData.type !== undefined) {
      updateData.type = toDbDeviceType(deviceData.type);
    }
    
    if (deviceData.status !== undefined) {
      updateData.status = toDbDeviceStatus(deviceData.status);
    }
    
    if (deviceData.location !== undefined) {
      updateData.location = deviceData.location;
    }
    
    if (deviceData.capacity !== undefined) {
      updateData.capacity = deviceData.capacity;
    }
    
    if (deviceData.firmware !== undefined) {
      updateData.firmware = deviceData.firmware;
    }
    
    if (deviceData.description !== undefined) {
      updateData.description = deviceData.description;
    }
    
    if (deviceData.installation_date !== undefined) {
      updateData.installation_date = deviceData.installation_date;
    }
    
    if (deviceData.site_id !== undefined) {
      updateData.site_id = deviceData.site_id;
    }
    
    if (deviceData.metrics !== undefined) {
      updateData.metrics = deviceData.metrics;
    }
    
    // Update last_updated timestamp
    updateData.last_updated = new Date().toISOString();
    
    const { data, error } = await supabase
      .from('devices')
      .update(updateData)
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
    
    // Preserve the original frontend types
    const device: EnergyDevice = {
      ...data,
      type: deviceData.type || data.type as DeviceType,
      status: deviceData.status || data.status as DeviceStatus,
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
      await updateDevice(device.id, device.updates);
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
