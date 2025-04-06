
import { useState } from 'react';
import { DeviceModel } from '@/types/device-model';
import { DeviceType } from '@/types/energy';

// Custom hook for device model management
export const useDeviceModels = () => {
  const [models, setModels] = useState<DeviceModel[]>([]);
  
  // Mock retrieve models - in real implementation this would fetch from API
  const retrieveDeviceModels = (): DeviceModel[] => {
    // Sample device models (would come from API)
    const sampleModels: DeviceModel[] = [
      {
        id: '1',
        name: 'Tesla Powerwall',
        manufacturer: 'Tesla',
        model_name: 'Powerwall 2',
        model_number: 'PW2',
        device_type: 'battery' as DeviceType,
        category: 'Battery Systems',
        description: 'Home battery system for energy storage',
        specifications: {
          capacity: 13.5,
          power: 7,
          efficiency: 90
        },
        power_rating: 7,
        capacity: 13.5,
        protocol: 'Modbus TCP',
        support_level: 'full',
        compatible_with: ['SolarEdge', 'Fronius', 'SMA'],
        firmware_versions: ['1.45.0', '1.46.1'],
        warranty: '10 years',
        release_date: '2016-10-28',
        firmware_version: '1.46.1',
        has_manual: true,
      },
      {
        id: '2',
        name: 'SolarEdge Inverter',
        manufacturer: 'SolarEdge',
        model_name: 'SE10K',
        model_number: 'SE10000H-US',
        device_type: 'inverter' as DeviceType,
        category: 'Solar Inverters',
        description: 'Three-phase string inverter with HD-Wave technology',
        specifications: {
          power: 10,
          mppt: 2,
          efficiency: 99
        },
        power_rating: 10,
        protocol: 'SunSpec',
        support_level: 'full',
        compatible_with: ['Tesla Powerwall', 'LG Chem RESU'],
        firmware_versions: ['3.2243', '3.2249'],
        warranty: '12 years',
        release_date: '2018-05-15',
        firmware_version: '3.2249',
        has_manual: true,
      },
      {
        id: '3',
        name: 'Enphase IQ8',
        manufacturer: 'Enphase',
        model_name: 'IQ8+',
        model_number: 'IQ8PLUS-72-2-US',
        device_type: 'inverter' as DeviceType,
        category: 'Solar Inverters',
        description: 'Grid-forming microinverter with Sunlight Backup™',
        specifications: {
          power: 0.29,
          efficiency: 97,
        },
        power_rating: 0.29,
        protocol: 'Envoy',
        support_level: 'beta',
        compatible_with: ['Enphase Battery', 'Enphase Combiner'],
        firmware_versions: ['7.0.1', '7.0.2'],
        warranty: '25 years',
        release_date: '2021-10-25',
        firmware_version: '7.0.2',
        has_manual: true,
      }
    ];
    
    return sampleModels;
  };
  
  // Load models
  const loadModels = () => {
    const deviceModels = retrieveDeviceModels();
    setModels(deviceModels);
    return deviceModels;
  };
  
  // Filter models by type
  const filterModelsByType = (type: string): DeviceModel[] => {
    return models.filter(model => model.device_type === type);
  };
  
  // Get model by ID
  const getModelById = (id: string): DeviceModel | undefined => {
    return models.find(model => model.id === id);
  };
  
  return {
    models,
    loadModels,
    filterModelsByType,
    getModelById
  };
};

export default useDeviceModels;
