import { DeviceModel } from '@/types/device-model';
import { toast } from 'sonner';
import { DeviceModelCategory } from '@/types/device-model-category';

// Fetch all device models
export const fetchDeviceModels = async (): Promise<DeviceModel[]> => {
  try {
    const { data, error } = await supabase
      .from('device_models')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('Error fetching device models:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error in fetchDeviceModels:', error);
    return [];
  }
};

// Fetch a specific device model by ID
export const fetchDeviceModelById = async (id: string): Promise<DeviceModel | null> => {
  try {
    const { data, error } = await supabase
      .from('device_models')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching device model:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error in fetchDeviceModelById:', error);
    return null;
  }
};

// Create a new device model
export const createDeviceModel = async (model: Partial<DeviceModel>): Promise<DeviceModel | null> => {
  try {
    const { data, error } = await supabase
      .from('device_models')
      .insert([model])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating device model:', error);
      toast.error(`Failed to create device model: ${error.message}`);
      return null;
    }
    
    toast.success('Device model created successfully');
    return data;
  } catch (error: any) {
    console.error('Error in createDeviceModel:', error);
    toast.error(`An error occurred: ${error.message}`);
    return null;
  }
};

// Update an existing device model
export const updateDeviceModel = async (id: string, model: Partial<DeviceModel>): Promise<DeviceModel | null> => {
  try {
    const { data, error } = await supabase
      .from('device_models')
      .update(model)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating device model:', error);
      toast.error(`Failed to update device model: ${error.message}`);
      return null;
    }
    
    toast.success('Device model updated successfully');
    return data;
  } catch (error: any) {
    console.error('Error in updateDeviceModel:', error);
    toast.error(`An error occurred: ${error.message}`);
    return null;
  }
};

// Delete a device model
export const deleteDeviceModel = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('device_models')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting device model:', error);
      toast.error(`Failed to delete device model: ${error.message}`);
      return false;
    }
    
    toast.success('Device model deleted successfully');
    return true;
  } catch (error: any) {
    console.error('Error in deleteDeviceModel:', error);
    toast.error(`An error occurred: ${error.message}`);
    return false;
  }
};

// Fetch device models by type
export const fetchDeviceModelsByType = async (type: string): Promise<DeviceModel[]> => {
  try {
    const { data, error } = await supabase
      .from('device_models')
      .select('*')
      .ilike('device_type', `%${type}%`)
      .order('name');
    
    if (error) {
      console.error(`Error fetching ${type} models:`, error);
      return [];
    }
    
    return data;
  } catch (error) {
    console.error(`Error in fetchDeviceModelsByType for ${type}:`, error);
    return [];
  }
};

// Get all categories of device models
export const getDeviceCategories = async (): Promise<DeviceModelCategory[]> => {
  try {
    // Get all unique categories and count of devices in each
    // Note: We're now using a simpler approach instead of 'distinct'
    const { data, error } = await supabase
      .from('device_models')
      .select('category')
      .order('category');
    
    if (error) {
      console.error('Error fetching device categories:', error);
      return [];
    }
    
    // Process the results to get unique categories with counts
    const categoriesMap = data.reduce<Record<string, number>>((acc, item) => {
      const category = item.category;
      if (category) {
        if (acc[category]) {
          acc[category] += 1;
        } else {
          acc[category] = 1;
        }
      }
      return acc;
    }, {});
    
    // Convert to the category format
    const categories = Object.keys(categoriesMap).map((name) => ({
      id: name.toLowerCase().replace(/\s+/g, '-'),
      name,
      device_count: categoriesMap[name]
    }));
    
    return categories;
  } catch (error) {
    console.error('Error in getDeviceCategories:', error);
    return [];
  }
};

// Seed mock device models for testing
export const seedDeviceModels = () => {
  const models = [
    {
      id: '1',
      name: 'SolarEdge SE10000H-US',
      manufacturer: 'SolarEdge',
      model_number: 'SE10000H-US',
      device_type: 'Solar Inverter',
      category: 'Solar Inverters',
      power_rating: 10000,
      support_level: 'full' as const,
      protocol: 'Modbus TCP',
      description: 'Single phase inverter with HD-Wave technology',
      has_manual: true,
      has_datasheet: true,
      has_video: true,
      firmware_version: '1.0.12',
      certifications: ['UL1741', 'IEEE1547']
    },
    {
      id: '2',
      name: 'Tesla Powerwall 2',
      manufacturer: 'Tesla',
      model_number: 'PW2',
      device_type: 'Battery Storage',
      category: 'Battery Systems',
      capacity: 13.5,
      support_level: 'full' as const,
      protocol: 'Modbus TCP',
      description: 'Rechargeable home battery system',
      has_manual: true,
      has_datasheet: true, 
      has_video: false,
      firmware_version: '22.9.3',
      certifications: ['UL', 'IEC']
    },
    {
      id: '3',
      name: 'Schneider Electric EVLink',
      manufacturer: 'Schneider Electric',
      model_number: 'EVB1A22P4KI',
      device_type: 'EV Charger',
      category: 'EV Chargers',
      power_rating: 22,
      support_level: 'partial' as const,
      protocol: 'OCPP 1.6J',
      description: '22kW EV charging station with authentication',
      has_manual: true,
      has_datasheet: true,
      has_video: true,
      firmware_version: '3.4.0',
      certifications: ['CE', 'IEC 61851-1']
    },
    // Add more sample models as needed
    {
      id: '4',
      name: 'Fronius Symo 10.0-3-M',
      manufacturer: 'Fronius',
      model_number: 'SYMO 10.0-3-M',
      device_type: 'Solar Inverter',
      category: 'Solar Inverters',
      power_rating: 10000,
      support_level: 'beta' as const,
      protocol: 'Modbus RTU',
      description: 'Three-phase inverter with integrated data monitoring',
      has_manual: true,
      has_datasheet: true,
      has_video: false,
      firmware_version: '2.6.3-5',
      certifications: ['CE', 'VDE AR N 4105']
    },
    {
      id: '5',
      name: 'LG RESU10H',
      manufacturer: 'LG Energy Solution',
      model_number: 'RESU10H',
      device_type: 'Battery Storage',
      category: 'Battery Systems',
      capacity: 9.8,
      support_level: 'community' as const,
      protocol: 'CAN',
      description: 'Home battery system for residential energy storage',
      has_manual: false,
      has_datasheet: true,
      has_video: false,
      firmware_version: '1.2.4',
      certifications: ['UL1973', 'UN38.3']
    }
  ];
  
  return models;
};
