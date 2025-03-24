
import { supabase } from '@/integrations/supabase/client';
import { DeviceModel } from '@/components/integrations/DeviceModelsTable';
import { toast } from 'sonner';

/**
 * Fetch device models from the database
 */
export const fetchDeviceModels = async (
  category?: string,
  searchQuery?: string,
  sortField: string = 'name',
  sortDirection: 'asc' | 'desc' = 'asc'
): Promise<DeviceModel[]> => {
  try {
    let query = supabase
      .from('device_models')
      .select('*');

    // Apply category filter
    if (category && category !== 'all') {
      query = query.eq('category', category);
    }

    // Apply search query
    if (searchQuery) {
      query = query.or(`name.ilike.%${searchQuery}%,manufacturer.ilike.%${searchQuery}%,model_number.ilike.%${searchQuery}%`);
    }

    // Apply sorting
    query = query.order(sortField, { ascending: sortDirection === 'asc' });

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching device models:', error);
      toast.error('Failed to fetch device models');
      return [];
    }

    return data.map(model => ({
      id: model.id,
      name: model.name,
      manufacturer: model.manufacturer,
      model_number: model.model_number,
      device_type: model.device_type,
      category: model.category,
      protocol: model.protocol || 'Unknown',
      firmware_version: model.firmware_version,
      power_rating: model.power_rating,
      capacity: model.capacity,
      release_date: model.release_date,
      support_level: model.support_level as 'full' | 'partial' | 'none',
      has_manual: !!model.manuals,
      has_datasheet: !!model.datasheets,
      has_video: !!(model.videos && Object.keys(model.videos).length > 0),
      description: model.description,
      specifications: model.specifications,
      connectivity: model.connectivity,
      warranty: model.warranty,
      certifications: model.certifications
    }));
  } catch (error) {
    console.error('Error in fetchDeviceModels:', error);
    toast.error('Failed to load device models');
    return [];
  }
};

/**
 * Fetch a single device model by ID
 */
export const fetchDeviceModelById = async (id: string): Promise<DeviceModel | null> => {
  try {
    const { data, error } = await supabase
      .from('device_models')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching device model:', error);
      toast.error('Failed to fetch device model');
      return null;
    }

    return {
      id: data.id,
      name: data.name,
      manufacturer: data.manufacturer,
      model_number: data.model_number,
      device_type: data.device_type,
      category: data.category,
      protocol: data.protocol || 'Unknown',
      firmware_version: data.firmware_version,
      power_rating: data.power_rating,
      capacity: data.capacity,
      release_date: data.release_date,
      support_level: data.support_level as 'full' | 'partial' | 'none',
      has_manual: !!data.manuals,
      has_datasheet: !!data.datasheets,
      has_video: !!(data.videos && Object.keys(data.videos).length > 0),
      description: data.description,
      specifications: data.specifications,
      connectivity: data.connectivity,
      warranty: data.warranty,
      certifications: data.certifications
    };
  } catch (error) {
    console.error('Error in fetchDeviceModelById:', error);
    toast.error('Failed to load device model');
    return null;
  }
};

/**
 * Create a new device model
 */
export const createDeviceModel = async (model: Partial<DeviceModel>): Promise<DeviceModel | null> => {
  try {
    const { data, error } = await supabase
      .from('device_models')
      .insert([model])
      .select()
      .single();

    if (error) {
      console.error('Error creating device model:', error);
      toast.error('Failed to create device model');
      return null;
    }

    toast.success('Device model created successfully');
    return data as unknown as DeviceModel;
  } catch (error) {
    console.error('Error in createDeviceModel:', error);
    toast.error('Failed to create device model');
    return null;
  }
};

/**
 * Update an existing device model
 */
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
      toast.error('Failed to update device model');
      return null;
    }

    toast.success('Device model updated successfully');
    return data as unknown as DeviceModel;
  } catch (error) {
    console.error('Error in updateDeviceModel:', error);
    toast.error('Failed to update device model');
    return null;
  }
};

/**
 * Delete a device model
 */
export const deleteDeviceModel = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('device_models')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting device model:', error);
      toast.error('Failed to delete device model');
      return false;
    }

    toast.success('Device model deleted successfully');
    return true;
  } catch (error) {
    console.error('Error in deleteDeviceModel:', error);
    toast.error('Failed to delete device model');
    return false;
  }
};

/**
 * Function to seed the database with sample device models
 * This would typically be called once from an admin page
 */
export const seedDeviceModels = async (): Promise<boolean> => {
  const deviceTypes = ['battery', 'inverter', 'ev_charger', 'meter', 'controller'];
  const categories = ['batteries', 'inverters', 'ev-chargers', 'meters', 'controllers'];
  
  const manufacturers = {
    battery: ['Tesla', 'LG Chem', 'BYD', 'Sonnen', 'Enphase', 'Simpliphi', 'Pylontech', 'Dyness', 'Solax', 'Huawei'],
    inverter: ['SMA', 'Fronius', 'SolarEdge', 'Enphase', 'ABB', 'Huawei', 'GoodWe', 'Sungrow', 'Delta', 'Growatt'],
    ev_charger: ['Tesla', 'ChargePoint', 'Wallbox', 'EVBox', 'Schneider Electric', 'ABB', 'Siemens', 'Webasto', 'ClipperCreek', 'Enel X'],
    meter: ['Schneider Electric', 'ABB', 'Siemens', 'Eaton', 'Elster', 'Itron', 'Landis+Gyr', 'Honeywell', 'GE', 'Sensus'],
    controller: ['SMA', 'Fronius', 'Victron Energy', 'Morningstar', 'Outback Power', 'Schneider Electric', 'Midnite Solar', 'Studer', 'Magnum Energy', 'Blue Sky Energy']
  };
  
  // Generate protocol options for each device type
  const protocols = {
    battery: ['CAN', 'Modbus TCP', 'Modbus RTU', 'RS485', 'Proprietary'],
    inverter: ['SunSpec', 'Modbus TCP', 'Modbus RTU', 'REST API', 'MQTT'],
    ev_charger: ['OCPP 1.6', 'OCPP 2.0', 'Modbus TCP', 'REST API', 'Proprietary'],
    meter: ['Modbus RTU', 'Modbus TCP', 'BACnet', 'DLMS/COSEM', 'DNP3'],
    controller: ['Modbus TCP', 'Modbus RTU', 'CAN', 'REST API', 'MQTT']
  };

  const deviceModels = [];

  // Create at least 25 models for each manufacturer in each device type
  for (const deviceType of deviceTypes) {
    const category = categories[deviceTypes.indexOf(deviceType)];
    const manufacturerList = manufacturers[deviceType as keyof typeof manufacturers];

    for (const manufacturer of manufacturerList) {
      // Create at least 10 models for each manufacturer
      for (let i = 1; i <= 10; i++) {
        const modelNumber = `${deviceType.substring(0, 3).toUpperCase()}-${String(i).padStart(3, '0')}`;
        const releaseYear = 2015 + Math.floor(Math.random() * 8); // Random year between 2015 and 2022
        const releaseMonth = 1 + Math.floor(Math.random() * 12); // Random month between 1 and 12
        const releaseDay = 1 + Math.floor(Math.random() * 28); // Random day between 1 and 28
        const releaseDate = `${releaseYear}-${String(releaseMonth).padStart(2, '0')}-${String(releaseDay).padStart(2, '0')}`;
        
        // Generate capacities and power ratings based on device type
        let capacity = null;
        let powerRating = null;

        if (deviceType === 'battery') {
          capacity = 3 + Math.floor(Math.random() * 20); // 3-22 kWh
        } else if (deviceType === 'inverter') {
          powerRating = 1.5 + Math.floor(Math.random() * 10) + Math.random(); // 1.5-11 kW with decimal
          powerRating = Math.round(powerRating * 10) / 10; // Round to 1 decimal place
        } else if (deviceType === 'ev_charger') {
          powerRating = 3.7 + Math.floor(Math.random() * 4) * 3.7; // 3.7, 7.4, 11.1, or 14.8 kW
          powerRating = Math.round(powerRating * 10) / 10; // Round to 1 decimal place
        }

        // Determine support level with most models having at least partial support
        const supportLevelRand = Math.random();
        let supportLevel = 'none';
        if (supportLevelRand > 0.7) {
          supportLevel = 'full';
        } else if (supportLevelRand > 0.2) {
          supportLevel = 'partial';
        }

        // Select a random protocol for this device type
        const protocolList = protocols[deviceType as keyof typeof protocols];
        const protocol = protocolList[Math.floor(Math.random() * protocolList.length)];
        
        // Create specifications JSON
        const specs: any = {};
        
        if (deviceType === 'battery') {
          specs.chemistry = ['Lithium-Ion', 'LiFePO4', 'NMC', 'Lead-Acid'][Math.floor(Math.random() * 4)];
          specs.voltage = [12, 24, 48, 400][Math.floor(Math.random() * 4)];
          specs.cycles = [3000, 5000, 6000, 10000][Math.floor(Math.random() * 4)];
          specs.efficiencyPercent = 85 + Math.floor(Math.random() * 10);
        } else if (deviceType === 'inverter') {
          specs.mpptCount = 1 + Math.floor(Math.random() * 3);
          specs.efficiency = (95 + Math.random() * 4).toFixed(1) + "%";
          specs.phases = [1, 3][Math.floor(Math.random() * 2)];
          specs.acVoltage = specs.phases === 1 ? 230 : 400;
        } else if (deviceType === 'ev_charger') {
          specs.connectorType = ['Type 2', 'CCS', 'CHAdeMO'][Math.floor(Math.random() * 3)];
          specs.maxCurrent = [16, 32, 63][Math.floor(Math.random() * 3)];
          specs.phases = [1, 3][Math.floor(Math.random() * 2)];
          specs.cableLength = [5, 7.5, 10][Math.floor(Math.random() * 3)];
        }
        
        // Create connectivity JSON
        const connectivity: any = {
          wifi: Math.random() > 0.5,
          ethernet: Math.random() > 0.3,
          bluetooth: Math.random() > 0.7,
          cellular: Math.random() > 0.8,
          protocols: [protocol]
        };
        
        // Certifications
        const possibleCertifications = ['UL', 'CE', 'TUV', 'RoHS', 'IEC', 'IP65', 'ISO 9001'];
        const certificationCount = 1 + Math.floor(Math.random() * 4);
        const certifications = [];
        
        for (let j = 0; j < certificationCount; j++) {
          const cert = possibleCertifications[Math.floor(Math.random() * possibleCertifications.length)];
          if (!certifications.includes(cert)) {
            certifications.push(cert);
          }
        }
        
        // Create the device model object
        const deviceModel = {
          name: `${manufacturer} ${deviceType === 'ev_charger' ? 'EV Charger' : deviceType.charAt(0).toUpperCase() + deviceType.slice(1)} ${i}`,
          manufacturer,
          model_number: `${manufacturer.substring(0, 3)}-${modelNumber}`,
          device_type: deviceType,
          category,
          protocol,
          firmware_version: `${Math.floor(Math.random() * 5)}.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 20)}`,
          power_rating: powerRating,
          capacity,
          release_date: releaseDate,
          support_level: supportLevel,
          description: `The ${manufacturer} ${deviceType.charAt(0).toUpperCase() + deviceType.slice(1)} ${i} is a high-performance ${deviceType} designed for residential and commercial applications.`,
          specifications: specs,
          connectivity,
          dimensions: `${30 + Math.floor(Math.random() * 40)}x${20 + Math.floor(Math.random() * 30)}x${10 + Math.floor(Math.random() * 20)} cm`,
          weight: 5 + Math.floor(Math.random() * 45),
          warranty: `${3 + Math.floor(Math.random() * 8)} years`,
          certifications,
          // Add documentation based on support level
          manuals: supportLevel !== 'none' ? { url: `/manuals/${manufacturer.toLowerCase().replace(/\s+/g, '-')}-${modelNumber.toLowerCase()}.pdf` } : null,
          datasheets: { url: `/datasheets/${manufacturer.toLowerCase().replace(/\s+/g, '-')}-${modelNumber.toLowerCase()}.pdf` },
          // Only add videos for some models
          videos: Math.random() > 0.6 ? { 
            installation: `/videos/${manufacturer.toLowerCase().replace(/\s+/g, '-')}-${modelNumber.toLowerCase()}-installation.mp4`,
            tutorial: Math.random() > 0.5 ? `/videos/${manufacturer.toLowerCase().replace(/\s+/g, '-')}-${modelNumber.toLowerCase()}-tutorial.mp4` : null
          } : null
        };
        
        deviceModels.push(deviceModel);
      }
    }
  }

  try {
    // Split into batches of 100 to avoid hitting request size limits
    const batchSize = 100;
    const batches = [];
    
    for (let i = 0; i < deviceModels.length; i += batchSize) {
      batches.push(deviceModels.slice(i, i + batchSize));
    }
    
    for (const batch of batches) {
      const { error } = await supabase.from('device_models').insert(batch);
      
      if (error) {
        console.error('Error seeding device models:', error);
        toast.error('Failed to seed device models');
        return false;
      }
    }
    
    toast.success(`Successfully seeded ${deviceModels.length} device models`);
    return true;
  } catch (error) {
    console.error('Error in seedDeviceModels:', error);
    toast.error('Failed to seed device models');
    return false;
  }
};

export const getDeviceCategories = async (): Promise<string[]> => {
  try {
    const { data, error } = await supabase
      .from('device_models')
      .select('category')
      .distinct();
    
    if (error) {
      console.error('Error fetching device categories:', error);
      return ['all', 'batteries', 'inverters', 'ev-chargers', 'meters', 'controllers'];
    }
    
    return ['all', ...data.map(item => item.category)];
  } catch (error) {
    console.error('Error in getDeviceCategories:', error);
    return ['all', 'batteries', 'inverters', 'ev-chargers', 'meters', 'controllers'];
  }
};
