
import { supabase } from '@/integrations/supabase/client';
import { DeviceModelReference, DeviceManufacturer, deviceCategories } from '@/types/device-catalog';
import { DeviceType } from '@/types/energy';
import { toast } from 'sonner';

// Fetch all device models
export const getAllDeviceModels = async (): Promise<DeviceModelReference[]> => {
  try {
    const { data, error } = await supabase
      .from('device_models')
      .select('*')
      .order('manufacturer', { ascending: true });

    if (error) {
      throw new Error(`Error fetching device models: ${error.message}`);
    }

    return data as DeviceModelReference[];
  } catch (error) {
    console.error("Error in getAllDeviceModels:", error);
    toast.error("Failed to load device models");
    return [];
  }
};

// Fetch device models by category
export const getDeviceModelsByCategory = async (categoryId: string): Promise<DeviceModelReference[]> => {
  try {
    const { data, error } = await supabase
      .from('device_models')
      .select('*')
      .eq('category', categoryId)
      .order('manufacturer', { ascending: true });

    if (error) {
      throw new Error(`Error fetching device models by category: ${error.message}`);
    }

    return data as DeviceModelReference[];
  } catch (error) {
    console.error(`Error in getDeviceModelsByCategory(${categoryId}):`, error);
    toast.error(`Failed to load ${getCategoryName(categoryId)} models`);
    return [];
  }
};

// Fetch a single device model by ID
export const getDeviceModelById = async (modelId: string): Promise<DeviceModelReference | null> => {
  try {
    const { data, error } = await supabase
      .from('device_models')
      .select('*')
      .eq('id', modelId)
      .maybeSingle();

    if (error) {
      throw new Error(`Error fetching device model: ${error.message}`);
    }

    return data as DeviceModelReference;
  } catch (error) {
    console.error(`Error in getDeviceModelById(${modelId}):`, error);
    toast.error("Failed to load device model details");
    return null;
  }
};

// Fetch all manufacturers
export const getAllManufacturers = async (): Promise<DeviceManufacturer[]> => {
  try {
    // For now, extract unique manufacturers from device_models table
    const { data, error } = await supabase
      .from('device_models')
      .select('manufacturer')
      .order('manufacturer');

    if (error) {
      throw new Error(`Error fetching manufacturers: ${error.message}`);
    }

    // Convert to array of unique manufacturer names
    const uniqueManufacturers = Array.from(new Set(data.map(item => item.manufacturer)));
    
    // Create DeviceManufacturer objects
    return uniqueManufacturers.map(name => ({
      id: name.toLowerCase().replace(/\s+/g, '-'),
      name
    }));
  } catch (error) {
    console.error("Error in getAllManufacturers:", error);
    toast.error("Failed to load manufacturers");
    return [];
  }
};

// Helper to get category name by ID
export const getCategoryName = (categoryId: string): string => {
  const category = deviceCategories.find(c => c.id === categoryId);
  return category ? category.name : categoryId.charAt(0).toUpperCase() + categoryId.slice(1).replace('_', ' ');
};

// Create a new device model (admin function)
export const createDeviceModel = async (modelData: Omit<DeviceModelReference, 'id'>): Promise<DeviceModelReference | null> => {
  try {
    const { data, error } = await supabase
      .from('device_models')
      .insert(modelData)
      .select()
      .single();

    if (error) {
      throw new Error(`Error creating device model: ${error.message}`);
    }

    toast.success("Device model added to catalog");
    return data as DeviceModelReference;
  } catch (error) {
    console.error("Error in createDeviceModel:", error);
    toast.error("Failed to create device model");
    return null;
  }
};

// Update existing device model
export const updateDeviceModel = async (modelId: string, updates: Partial<DeviceModelReference>): Promise<DeviceModelReference | null> => {
  try {
    const { data, error } = await supabase
      .from('device_models')
      .update(updates)
      .eq('id', modelId)
      .select()
      .single();

    if (error) {
      throw new Error(`Error updating device model: ${error.message}`);
    }

    toast.success("Device model updated successfully");
    return data as DeviceModelReference;
  } catch (error) {
    console.error(`Error in updateDeviceModel(${modelId}):`, error);
    toast.error("Failed to update device model");
    return null;
  }
};

// Delete a device model
export const deleteDeviceModel = async (modelId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('device_models')
      .delete()
      .eq('id', modelId);

    if (error) {
      throw new Error(`Error deleting device model: ${error.message}`);
    }

    toast.success("Device model deleted from catalog");
    return true;
  } catch (error) {
    console.error(`Error in deleteDeviceModel(${modelId}):`, error);
    toast.error("Failed to delete device model");
    return false;
  }
};
