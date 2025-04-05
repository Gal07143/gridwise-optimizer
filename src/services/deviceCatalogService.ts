
import { supabase } from '@/integrations/supabase/client';
import { DeviceModel } from '@/types/device';
import { toast } from 'sonner';

// Get all device categories
export const getDeviceCategories = async (): Promise<string[]> => {
  try {
    const { data, error } = await supabase
      .from('device_models')
      .select('category')
      .not('category', 'is', null)
      .order('category');
      
    if (error) throw error;
    
    // Extract unique categories
    const categories = [...new Set(data.map(item => item.category || 'Uncategorized'))];
    return categories;
    
  } catch (err) {
    console.error('Error fetching device categories:', err);
    toast.error('Failed to fetch device categories');
    return [];
  }
};

// Get device models by type
export const getDeviceModelsByType = async (type: string): Promise<DeviceModel[]> => {
  try {
    const { data, error } = await supabase
      .from('device_models')
      .select('*')
      .eq('device_type', type)
      .order('name');
      
    if (error) throw error;
    
    return data || [];
    
  } catch (err) {
    console.error(`Error fetching device models by type (${type}):`, err);
    toast.error('Failed to fetch device models');
    return [];
  }
};

// Get device models by category (renaming function to be consistent)
export const getDeviceModelsByCategory = async (category: string): Promise<DeviceModel[]> => {
  try {
    const { data, error } = await supabase
      .from('device_models')
      .select('*')
      .eq('category', category)
      .order('name');
      
    if (error) throw error;
    
    return data || [];
    
  } catch (err) {
    console.error(`Error fetching device models by category (${category}):`, err);
    toast.error('Failed to fetch device models');
    return [];
  }
};

// Get a single device model by ID
export const getDeviceModelById = async (id: string): Promise<DeviceModel | null> => {
  try {
    const { data, error } = await supabase
      .from('device_models')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) throw error;
    
    return data;
    
  } catch (err) {
    console.error(`Error fetching device model (${id}):`, err);
    toast.error('Failed to fetch device model');
    return null;
  }
};

// Get category name
export const getCategoryName = (category: string): string => {
  // Format the category name for display
  if (!category) return 'Uncategorized';
  
  return category.charAt(0).toUpperCase() + category.slice(1).replace(/-/g, ' ');
};

export default {
  getDeviceCategories,
  getDeviceModelsByType,
  getDeviceModelsByCategory,
  getDeviceModelById,
  getCategoryName
};
