
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
    
    // Validate device type if provided
    if (deviceData.type && !isValidDeviceType(deviceData.type)) {
      throw new Error('Invalid device type');
    }
    
    // Validate device status if provided
    if (deviceData.status && !isValidDeviceStatus(deviceData.status)) {
      throw new Error('Invalid device status');
    }
    
    const { data, error } = await supabase
      .from('devices')
      .update({
        name: deviceData.name,
        type: deviceData.type,
        status: deviceData.status,
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
      const { error } = await supabase
        .from('devices')
        .update(device.updates)
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
function isValidDeviceType(type: string): type is DeviceType {
  return ['solar', 'wind', 'battery', 'grid', 'load', 'ev_charger', 'inverter', 'meter'].includes(type as DeviceType);
}

function isValidDeviceStatus(status: string): type is DeviceStatus {
  return ['online', 'offline', 'maintenance', 'error', 'warning'].includes(status as DeviceStatus);
}
