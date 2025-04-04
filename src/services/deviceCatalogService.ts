
import { DeviceModel } from '@/types/device-model';
import { supabase } from '@/integrations/supabase/client';
import { shouldPopulateDeviceDatabase, importDeviceData } from '@/utils/deviceDataImporter';

export interface DeviceManufacturer {
  id: string;
  name: string;
  device_count: number;
}

export interface DeviceModelReference {
  id: string;
  manufacturer: string;
  model_name: string;
  model_number: string;
  device_type: string;
  description?: string;
}

/**
 * Get all device models from the database
 */
export async function getAllDeviceModels(): Promise<DeviceModel[]> {
  try {
    // Check if we need to populate the database first
    const needsPopulation = await shouldPopulateDeviceDatabase();
    if (needsPopulation) {
      await importDeviceData();
    }

    const { data, error } = await supabase
      .from('device_models')
      .select('*')
      .order('manufacturer', { ascending: true });

    if (error) {
      console.error('Error fetching device models:', error);
      throw new Error(error.message);
    }

    return data || [];
  } catch (error) {
    console.error('Error in getAllDeviceModels:', error);
    throw error;
  }
}

/**
 * Get a device model by its ID
 */
export async function getDeviceModelById(modelId: string): Promise<DeviceModel> {
  try {
    const { data, error } = await supabase
      .from('device_models')
      .select('*')
      .eq('id', modelId)
      .single();

    if (error) {
      console.error('Error fetching device model:', error);
      throw new Error(error.message);
    }

    if (!data) {
      throw new Error(`Device model with ID ${modelId} not found`);
    }

    return data;
  } catch (error) {
    console.error(`Error in getDeviceModelById for ID ${modelId}:`, error);
    throw error;
  }
}

/**
 * Get device models by type
 */
export async function getDeviceModelsByType(deviceType: string): Promise<DeviceModel[]> {
  try {
    const { data, error } = await supabase
      .from('device_models')
      .select('*')
      .eq('device_type', deviceType)
      .order('manufacturer', { ascending: true });

    if (error) {
      console.error('Error fetching device models by type:', error);
      throw new Error(error.message);
    }

    return data || [];
  } catch (error) {
    console.error(`Error in getDeviceModelsByType for type ${deviceType}:`, error);
    throw error;
  }
}

/**
 * Get device models by manufacturer
 */
export async function getDeviceModelsByManufacturer(manufacturer: string): Promise<DeviceModel[]> {
  try {
    const { data, error } = await supabase
      .from('device_models')
      .select('*')
      .ilike('manufacturer', `%${manufacturer}%`)
      .order('model_name', { ascending: true });

    if (error) {
      console.error('Error fetching device models by manufacturer:', error);
      throw new Error(error.message);
    }

    return data || [];
  } catch (error) {
    console.error(`Error in getDeviceModelsByManufacturer for manufacturer ${manufacturer}:`, error);
    throw error;
  }
}

/**
 * Get all manufacturers
 */
export async function getAllManufacturers(): Promise<DeviceManufacturer[]> {
  try {
    const { data, error } = await supabase
      .from('device_models')
      .select('manufacturer');

    if (error) {
      console.error('Error fetching manufacturers:', error);
      throw new Error(error.message);
    }

    // Count unique manufacturers
    const manufacturerCounts: Record<string, number> = {};
    data?.forEach(item => {
      const manufacturer = item.manufacturer;
      if (manufacturer) {
        manufacturerCounts[manufacturer] = (manufacturerCounts[manufacturer] || 0) + 1;
      }
    });

    // Create manufacturer objects with counts
    const manufacturers: DeviceManufacturer[] = Object.entries(manufacturerCounts).map(([name, count]) => ({
      id: name.toLowerCase().replace(/\s+/g, '-'),
      name: name,
      device_count: count
    }));

    return manufacturers.sort((a, b) => a.name.localeCompare(b.name));
  } catch (error) {
    console.error('Error in getAllManufacturers:', error);
    throw error;
  }
}

/**
 * Search device models by query string
 */
export async function searchDeviceModels(query: string): Promise<DeviceModel[]> {
  try {
    const { data, error } = await supabase
      .from('device_models')
      .select('*')
      .or(`manufacturer.ilike.%${query}%,model_name.ilike.%${query}%,model_number.ilike.%${query}%,description.ilike.%${query}%`)
      .order('manufacturer', { ascending: true });

    if (error) {
      console.error('Error searching device models:', error);
      throw new Error(error.message);
    }

    return data || [];
  } catch (error) {
    console.error(`Error in searchDeviceModels for query ${query}:`, error);
    throw error;
  }
}

/**
 * Create a new device model
 */
export async function createDeviceModel(deviceModel: Partial<DeviceModel>): Promise<DeviceModel> {
  try {
    const { data, error } = await supabase
      .from('device_models')
      .insert([deviceModel])
      .select()
      .single();

    if (error) {
      console.error('Error creating device model:', error);
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error('Error in createDeviceModel:', error);
    throw error;
  }
}

/**
 * Update an existing device model
 */
export async function updateDeviceModel(modelId: string, deviceModel: Partial<DeviceModel>): Promise<DeviceModel> {
  try {
    const { data, error } = await supabase
      .from('device_models')
      .update(deviceModel)
      .eq('id', modelId)
      .select()
      .single();

    if (error) {
      console.error('Error updating device model:', error);
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error(`Error in updateDeviceModel for ID ${modelId}:`, error);
    throw error;
  }
}

/**
 * Delete a device model
 */
export async function deleteDeviceModel(modelId: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('device_models')
      .delete()
      .eq('id', modelId);

    if (error) {
      console.error('Error deleting device model:', error);
      throw new Error(error.message);
    }
  } catch (error) {
    console.error(`Error in deleteDeviceModel for ID ${modelId}:`, error);
    throw error;
  }
}
